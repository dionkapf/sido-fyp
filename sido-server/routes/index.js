let express = require("express");
let router = express.Router();
const { checkUsernameAvailability } = require("../controllers/users");

/* GET home page. */
router.get("/", (req, res) => {
  return res.status(200).json({ success: true, message: "Hello World" });
});

router.get("/user/:username", checkUsernameAvailability);

module.exports = router;
