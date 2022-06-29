let express = require("express");
let router = express.Router();
const { updateUser } = require("./../middleware/auth");
const { getUser } = require("./../controllers/users");
router.route("/:id").get(getUser).put(updateUser);
router.route("/change-password").put(() => {
  console.log("Change password");
});

module.exports = router;
