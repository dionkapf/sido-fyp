require("dotenv").config();
const bcrypt = require("bcrypt");
const {
  createUser,
  getUserDetails,
  USER_ROLE,
} = require("../controllers/users");
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
          const role = user.role;
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
            res.setHeader("Authorization", "Bearer " + accessToken);
            res.cookie("accessToken", user_data.accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
            });
            res.cookie("refreshToken", user_data.refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
            });
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

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access" });
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.log("Token has expired");
        const refreshToken = req.cookies.refreshToken;
        const { accessToken, success } = await refreshAccessTokenHandler(
          refreshToken
        );
        if (success) {
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });
          req.headers["authorization"] = `Bearer ${accessToken}`;
          return next();
        } else {
          return res
            .status(403)
            .json({ success: false, message: "Bad refresh token" });
        }
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Token is not valid" });
      }
    }
    req.user = user;
    next();
  });
}

function authorizeUserHandler(user, validRoles) {
  if (!user) {
    return false;
  }
  if (validRoles.includes(user.role)) {
    return true;
  }
  return false;
}

function authorizeAdmin(req, res, next) {
  validRoles = [user_role.ADMIN];
  if (authorizeUserHandler(req.user, validRoles)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "You do not have permission to perform this action",
    });
  }
}

function authorizeOperations(req, res, next) {
  validRoles = [
    USER_ROLE.ADMIN,
    USER_ROLE.BUSINESS,
    USER_ROLE.FINANCE,
    USER_ROLE.LOAN,
    USER_ROLE.TRAINING,
  ];
  if (authorizeUserHandler(req.user, validRoles)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "You do not have permission to perform this action",
    });
  }
}

function authorizeExecutive(req, res, next) {
  validRoles = [USER_ROLE.ADMIN, USER_ROLE.BUSINESS, USER_ROLE.FINANCE];
  if (authorizeUserHandler(req.user, validRoles)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "You do not have permission to perform this action",
    });
  }
}

const getCurrentUser = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];
  try {
    const { id, username, role, exp } = jwt.decode(accessToken);
    const user = await getUserDetails(id, role);
    const n = new Date(exp * 1000);
    if (!user) {
      console.log("No user?");
    } else {
      res.status(200).json({
        success: true,
        message: "User details retrieved successfully",
        user: {
          username,
          ...user,
          accessToken,
        },
      });
    }
  } catch (error) {
    if (error.message === "jwt expired") console.log("Expireed bitch");
  }
};

const validateToken = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          console.log("Token has expired");
          res.status(401).json({
            success: false,
            message: "Token has expired",
          });
        } else {
          res.status(403).json({
            success: false,
            message: "Token is not valid",
          });
        }
      } else {
        res.status(200).json({
          success: true,
          message: "Token is valid",
        });
      }
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "15m" });
}

async function refreshAccessTokenHandler(refreshToken) {
  let response = {};
  const token_data = await getToken(refreshToken);
  if (token_data && token_data.rowCount === 0) {
    return {
      success: false,
      message: "Forbidden",
    };
  } else {
    await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, user) => {
        if (err) {
          console.error("Error verifying token: ", err);
          return {
            success: false,
            message: "Forbidden",
          };
        }
        const accessToken = generateAccessToken({
          username: user.username,
          id: user.id,
          role: user.role,
        });
        console.log("Access TOken!", accessToken);
        response = {
          success: true,
          message: "Refresh token successful",
          accessToken,
        };
      }
    );
    return response;
  }
}

async function refreshAccessToken(req, res) {
  const refreshToken = req.cookies.refreshToken;
  console.log("Refresh token: ", refreshToken);
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token provided",
    });
  }
  const response = await refreshAccessTokenHandler(refreshToken);
  console.log("Response: ", response);
  if (response.success) {
    res.cookie("accessToken", response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
    });
  } else {
    res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }
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
  getCurrentUser,
  checkifUserExists,
  authenticateToken,
  validateToken,
  generateAccessToken,
  refreshAccessToken,
  authorizeAdmin,
  authorizeOperations,
  authorizeExecutive,
};
