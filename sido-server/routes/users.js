let express = require("express");
let router = express.Router();
const { updateUser, validatePassword } = require("./../middleware/auth");
const { getUser } = require("./../controllers/users");
router.route("/:id").get(getUser).put(updateUser);
router.route("/change-password/:id").put(validatePassword, updateUser);

module.exports = router;
