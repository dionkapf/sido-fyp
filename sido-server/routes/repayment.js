var express = require("express");
var router = express.Router();
const { getRepayment, getRepayments } = require("../controllers/repayment");

router.route("/").get(getRepayments);
router.route("/:id").get(getRepayment);

module.exports = router;
