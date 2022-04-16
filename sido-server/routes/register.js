const express = require("express");
const router = express.Router();
const { registerUser } = require("../middleware/auth");

// router.route("/").get((req, res) => {
//   res.status(200).json({ success: true, data: req.body });
// });
router.route("/").post(registerUser);

module.exports = router;
