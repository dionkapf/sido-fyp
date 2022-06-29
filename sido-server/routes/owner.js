let express = require("express");
let router = express.Router();
const {
  getOwner,
  getOwners,
  createOwner,
  updateOwner,
} = require("../controllers/owner");

router.route("/").get(getOwners).post(createOwner);
router.route("/:id").get(getOwner).put(updateOwner);

module.exports = router;
