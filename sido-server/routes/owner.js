let express = require("express");
let router = express.Router();
const { getOwner, getOwners, createOwner } = require("../controllers/owner");

router.route("/").get(getOwners).post(createOwner);
router.route("/:id").get(getOwner);

module.exports = router;
