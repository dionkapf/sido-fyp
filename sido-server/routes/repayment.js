let express = require("express");
let router = express.Router();
const {
  getRepayment,
  getRepayments,
  createRepayment,
  updateRepayment,
  deleteRepayment,
} = require("../controllers/repayment");

router.route("/").get(getRepayments).post(createRepayment);
router
  .route("/:id")
  .get(getRepayment)
  .put(updateRepayment)
  .delete(deleteRepayment);

module.exports = router;
