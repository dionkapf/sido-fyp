var express = require("express");
var router = express.Router();
const {
  getLoanRequest,
  getLoanRequests,
} = require("../controllers/loan_request");

router.route("/").get(getLoanRequests);
router.route("/:id").get(getLoanRequest);

module.exports = router;