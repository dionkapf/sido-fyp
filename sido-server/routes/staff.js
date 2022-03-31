var express = require("express");
var router = express.Router();
const { getStaff, getStaffs } = require("../controllers/staff");

router.route("/").get(getStaffs);
router.route("/:id").get(getStaff);

module.exports = router;
