var express = require("express");
var router = express.Router();
const { getRegion, getRegions } = require("../controllers/region");

router.route("/").get(getRegions);
router.route("/:id").get(getRegion);

module.exports = router;
