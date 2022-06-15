let express = require("express");
let router = express.Router();
const { getLoan, getLoans, getLoanDetails } = require("../controllers/loan");

router.route("/").get(getLoans);
router.route("/:id").get(getLoan);
router.route("/details/:id").get(getLoanDetails);

module.exports = router;
