let express = require("express");
let router = express.Router();
const {
  getWitness,
  getWitnesses,
  createWitness,
} = require("../controllers/witness");

router.route("/").get(getWitnesses).post(createWitness);
router.route("/:id").get(getWitness);

module.exports = router;
