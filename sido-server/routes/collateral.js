let express = require("express");
let router = express.Router();
const { getCollateral, getCollaterals } = require("../controllers/collateral");

router.route("/").get(getCollaterals);
router.route("/:id").get(getCollateral);

module.exports = router;
