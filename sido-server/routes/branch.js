var express = require("express");
var router = express.Router();
const { getBranch, getBranches } = require("../controllers/branch");

router.route("/").get(getBranches);
router.route("/:id").get(getBranch);

module.exports = router;
