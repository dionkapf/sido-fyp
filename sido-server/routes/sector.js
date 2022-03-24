var express = require("express");
var router = express.Router();
const { getSector, getSectors } = require("../controllers/sector");

router.route("/").get(getSectors);
router.route("/:id").get(getSector);

module.exports = router;
