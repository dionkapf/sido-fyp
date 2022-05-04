let express = require("express");
let router = express.Router();
const {
  getLoanRequest,
  getLoanRequests,
  getRequestAmount,
} = require("../controllers/loan_request");

router.route("/").get(getLoanRequests);
router.route("/:id").get(getLoanRequest);
router.route("/amount").get(getRequestAmount);

module.exports = router;
