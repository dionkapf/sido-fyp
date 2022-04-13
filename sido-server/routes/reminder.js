let express = require("express");
let router = express.Router();
const { getReminder, getReminders } = require("../controllers/reminder");

router.route("/").get(getReminders);
router.route("/:id").get(getReminder);

module.exports = router;
