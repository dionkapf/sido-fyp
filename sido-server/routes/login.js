const express = require("express");
const router = express.Router();
const { loginUser, authenticateToken } = require("../middleware/auth");
const jwt = require("jsonwebtoken");

router.route("/").get(authenticateToken, (req, res, next) => {
  console.log("I login now!", req.body);
  res.status(200).json({ success: true, data: req.user });
});

router.route("/").post(loginUser);

module.exports = router;
