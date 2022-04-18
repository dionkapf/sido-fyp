require("dotenv").config();
const bcrypt = require("bcrypt");
const { createUser, getUserDetails } = require("../controllers/users");
const saltRounds = 10;
const Model = require("../models/model").Model;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {
  getToken,
  deleteTokensByUserId,
  addToken,
  getTokensByUserId,
} = require("../controllers/token");

function checkPassword(password) {
  let re = /(?=.*[A-Z])(?=.*[a-z])(?=.+\d).{8,}/;
  return re.test(password);
}

function checkifUserExists(username) {
  return new Promise((resolve, reject) => {
    new Model(`"user"`)
      .select(
        `"user".id AS id, "user".name AS name, "user".password AS password`,
        "",
        [username],
        ["WHERE name = $1"]
      )
      .then((user_data) => {
        if (user_data.rows.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

const registerUser = async (req, res) => {
  console.log("Registering...");
  const { username, password, confirmPassword, role } = req.body;
  if (!(username && password && confirmPassword)) {
    res.status(400).json({ success: false, message: "Missing fields" });
  }
  if (password !== confirmPassword) {
    res.status(400).json({ success: false, message: "Passwords do not match" });
  } else if (!checkPassword(password)) {
    res
      .status(400)
      .json({ success: false, message: "Password is not strong enough" });
  } else if (username === password) {
    res.status(400).json({
      success: false,
      message: "Password cannot be the same as username",
    });
  } else if (await checkifUserExists(username)) {
    res.status(409).json({
      success: false,
      message: "Username already exists",
    });
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = { username, password: hashedPassword, role };
      console.log("User", user);
      await createUser(user);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  }
};

const loginUser = async (req, res) => {
  console.log("Logging in...");
  const { username, password } = req.body;
  if (!(username && password)) {
    res.status(400).json({ success: false, message: "Missing fields" });
  } else {
    try {
      const user = await new Model(`"user"`)
        .select(
          `"user".id AS id, "user".name AS name, "user".password AS password, "user".role AS role`,
          "",
          [username],
          ["WHERE name = $1"]
        )
        .then((user_data) => {
          if (user_data.rows.length > 0) {
            return user_data.rows[0];
          } else {
            return null;
          }
        });
      if (!user) {
        res.status(404).json({
          success: false,
          message: "Username and password do not match",
        });
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          res.status(401).json({
            success: false,
            message: "Username and password do not match",
          });
        } else {
          const accessToken = generateAccessToken({
            id: user.id,
            username: user.name,
            role: user.role,
          });
          let refreshToken = await getRefreshToken(user.id);
          console.log("Refresh token retrieved from database");
          if (!refreshToken) {
            console.log("Generating refresh token...");
            refreshToken = await generateRefreshToken(user);
          }
          const id = parseInt(user.id);
          const role = parseInt(user.role);
          const fuck = await getUserDetails(id, role);
          console.log("User details retrieved from database", fuck);
          await getUserDetails(id, role).then((user_details) => {
            if (!user_details) {
              console.log("User details not found");
            } else console.log("User: ", user_details);
            const user_data = {
              id: user.id,
              username: user.name,
              role: user.role,
              ...user_details,
              accessToken,
              refreshToken,
            };
            res.status(200).json({
              success: true,
              message: "Logged in successfully",
              user: user_data,
            });
          });
        }
      }
    } catch (err) {
      console.error("Login failed: ", err);
      res.status(401).json({ success: false, message: err.message });
    }
  }
};

function authenticateToken(req, res, next) {
  const { validRoles } = req.body;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(403)
          .json({ success: false, message: "Access Token has expired" });
      }
      console.error("Error verifying token: ", err);
      return res.status(403).json({ success: false, message: err.message });
    }
    req.user = user;
    next();
  });
}

function authorizeUser(req, res, next) {
  const { validRoles } = req.body;
  const { role } = req.user;
  if (validRoles.includes(role)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "You do not have permission to perform this action",
    });
  }
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "30s" });
}

function refreshAccessToken(req, res) {
  const refreshToken = req.body.refreshToken;
  console.log("Refresh token: ", refreshToken);
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token provided",
    });
  }
  getToken(refreshToken).then((token_data) => {
    if (token_data && token_data.rowCount === 0) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    } else {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) {
            return res.status(403).json({
              success: false,
              message: "Forbidden",
            });
          }
          const accessToken = generateAccessToken({
            username: user.username,
            id: user.id,
            role: user.role,
          });
          console.log(accessToken);
          res.status(200).json({
            success: true,
            message: "Refresh token successful",
            accessToken,
          });
        }
      );
    }
  });
}

function generateRefreshToken(user) {
  let expiry_date = new Date(Date.now());
  expiry_date.setDate(expiry_date.getDate() + 30);
  console.log("Today", new Date(Date.now()));
  console.log("Expiry date", expiry_date);
  const refreshToken = jwt.sign(
    { id: user.id, username: user.name, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );
  deleteTokensByUserId(user.id);
  addToken(refreshToken, user.id, expiry_date);
  // return refresh token
  return refreshToken;
}

async function getRefreshToken(user_id) {
  // Search for refresh token in database
  return await getTokensByUserId(user_id).then((token_data) => {
    const validTokens = token_data.rows.filter((token) => {
      return token.expiry_date > Date.now();
    });
    if (validTokens && validTokens.length > 0) {
      return validTokens[0].token;
    } else {
      deleteTokensByUserId(user_id);
      return null;
    }
  });
}

module.exports = {
  registerUser,
  loginUser,
  checkifUserExists,
  authenticateToken,
  generateAccessToken,
  refreshAccessToken,
};
