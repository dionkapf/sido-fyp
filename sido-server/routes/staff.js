let express = require("express");
let router = express.Router();
const { getStaff, getStaffs } = require("../controllers/staff");
const { getExecutives, getOperators } = require("../controllers/users");

router.route("/").get(getStaffs);
router.route("/executives").get(getExecutives);
router.route("/operators").get(getOperators);
router.route("/:id").get(getStaff);

module.exports = router;
