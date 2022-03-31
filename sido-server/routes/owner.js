var express = require("express");
var router = express.Router();
const { getOwner, getOwners } = require("../controllers/owner");

router.route("/").get(getOwners);
router.route("/:id").get(getOwner);

module.exports = router;
