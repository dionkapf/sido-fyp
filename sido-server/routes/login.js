const express = require("express");
const router = express.Router();
const {
  loginUser,
  authenticateToken,
  refreshAccessToken,
} = require("../middleware/auth");
const jwt = require("jsonwebtoken");

router.route("/ip").get((req, res) => {
  const remoteAddress = req.socket.remoteAddress;
  res.status(200).json({ ip: req.ip, remoteAddress });
});

router.route("/").get(authenticateToken, (req, res, next) => {
  console.log("I login now!", req.body);
  res.status(200).json({ success: true, data: req.user });
});

router.route("/token").get(refreshAccessToken);

router.route("/").post(loginUser);

module.exports = router;
