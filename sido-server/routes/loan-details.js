let express = require("express");
let router = express.Router();
const { getLoanDetails, getLoansDetails } = require("../controllers/loan");
router.route("/").get(getLoansDetails);
router.route("/:id").get(getLoanDetails);

module.exports = router;
