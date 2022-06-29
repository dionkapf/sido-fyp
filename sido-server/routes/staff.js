let express = require("express");
let router = express.Router();
const {
  getStaff,
  getStaffs,
  createStaff,
  updateStaff,
} = require("../controllers/staff");
const { getExecutives, getOperators } = require("../controllers/users");

router.route("/").get(getStaffs).post(createStaff);
router.route("/executives").get(getExecutives);
router.route("/operators").get(getOperators);
router.route("/:id").get(getStaff).put(updateStaff);

module.exports = router;
