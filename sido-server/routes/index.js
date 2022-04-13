let express = require("express");
let router = express.Router();
const { getDistrict, getDistricts } = require("../controllers/district");

/* GET home page. */
router.get("/", (req, res) => {
  return res.status(200).json({ success: true, message: "Hello World" });
});

module.exports = router;
