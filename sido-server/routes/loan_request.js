let express = require("express");
let router = express.Router();
const {
  getLoanRequest,
  getLoanRequests,
  getRequestAmount,
  createLoanRequest,
  updateLoanRequest,
} = require("../controllers/loan_request");

router.route("/").get(getLoanRequests).post(createLoanRequest);
router.route("/:id").get(getLoanRequest).put(updateLoanRequest);
router.route("/amount").get(getRequestAmount);

module.exports = router;
