let express = require("express");
let router = express.Router();
const { getRole, getRoles } = require("../controllers/role");

router.route("/").get(getRoles);
router.route("/:id").get(getRole);

module.exports = router;
