var express = require("express");
var router = express.Router();
const { getLoan, getLoans } = require("../controllers/loan");

router.route("/").get(getLoans);
router.route("/:id").get(getLoan);

module.exports = router;
