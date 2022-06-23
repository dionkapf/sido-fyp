let express = require("express");
let router = express.Router();
const {
  getLoan,
  getLoans,
  getLoanDetails,
  createLoan,
} = require("../controllers/loan");

router.route("/").get(getLoans).post(createLoan);
router.route("/:id").get(getLoan);
router.route("/details/:id").get(getLoanDetails);

module.exports = router;
