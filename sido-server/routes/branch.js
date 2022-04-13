let express = require("express");
let router = express.Router();
const { getBranch, getBranches } = require("../controllers/branch");

router.route("/").get(getBranches);
router.route("/:id").get(getBranch);

module.exports = router;
