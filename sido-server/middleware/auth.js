require("dotenv").config();
const bcrypt = require("bcrypt");
const { createUser } = require("../controllers/users");
const saltRounds = 10;
const Model = require("../models/model").Model;
const jwt = require("jsonwebtoken");

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
  const { username, password, confirmPassword } = req.body;
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
      const user = { username, password: hashedPassword };
      console.log("Entering function...");
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
          let expiry_date = new Date(Date.now());
          expiry_date.setDate(expiry_date.getDate() + 7);
          console.log("Expiry date: ", expiry_date);
          const refreshToken = jwt.sign(
            { id: user.id, username: user.name, role: user.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
          );
          addRefreshToken(refreshToken, user.id, expiry_date);
          res.user = user;
          delete res.user.password;
          res.user.accessToken = accessToken;
          res.user.refreshToken = refreshToken;
          const response = res.user;
          res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: response,
          });
        }
      }
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  }
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ success: false, message: err.message });
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "10m" });
}

function addRefreshToken(refreshToken, user_id, expiry_date) {
  new Model(`"refresh_token"`)
    .insert(
      [`token`, `user_id`, `expiry_date`],
      [refreshToken, user_id, expiry_date]
    )
    .then((data) => {
      console.log("Refresh token added");
      console.log("Token: ", data.rows);
    });
}

module.exports = {
  registerUser,
  loginUser,
  checkifUserExists,
  authenticateToken,
  generateAccessToken,
};
