var express = require("express");
var router = express.Router();
const { getWitness, getWitnesses } = require("../controllers/witness");

router.route("/").get(getWitnesses);
router.route("/:id").get(getWitness);

module.exports = router;
