let express = require("express");
let router = express.Router();
const {
  getCollateral,
  getCollaterals,
  createCollateral,
  updateCollateral,
} = require("../controllers/collateral");

router.route("/").get(getCollaterals).post(createCollateral);
router.route("/:id").get(getCollateral).put(updateCollateral);

module.exports = router;
