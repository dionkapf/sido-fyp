var express = require("express");
var router = express.Router();
const { getCollateral, getCollaterals } = require("../controllers/collateral");

router.route("/").get(getCollaterals);
router.route("/:id").get(getCollateral);

module.exports = router;
