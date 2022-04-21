const express = require("express");
const { getUser } = require("../controllers/users");
const router = express.Router();
const {
  loginUser,
  getCurrentUser,
  authenticateToken,
  refreshAccessToken,
  validateToken,
} = require("../middleware/auth");

router.route("/me").get(authenticateToken, getCurrentUser);
router.route("/validate").get(validateToken);

router
  .route("/")
  .get(authenticateToken, (req, res, next) => {
    console.log("I login now!", req.body);
    res.status(200).json({ success: true, data: req.user });
  })
  .post(loginUser);

router.route("/refresh").get(refreshAccessToken);

module.exports = router;
