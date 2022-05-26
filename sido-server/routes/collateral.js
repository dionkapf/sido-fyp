let express = require("express");
let router = express.Router();
const {
  getCollateral,
  getCollaterals,
  createCollateral,
} = require("../controllers/collateral");

router.route("/").get(getCollaterals).post(createCollateral);
router.route("/:id").get(getCollateral);

module.exports = router;
