var express = require("express");
var router = express.Router();
const { getDistrict, getDistricts } = require("../controllers/district");

router.route("/").get(getDistricts);
router.route("/:id").get(getDistrict);

module.exports = router;
