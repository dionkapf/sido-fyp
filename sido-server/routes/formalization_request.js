let express = require("express");
let router = express.Router();
const {
  getFormalizationRequest,
  getFormalizationRequests,
} = require("../controllers/formalization_request");

router.route("/").get(getFormalizationRequests);
router.route("/:id").get(getFormalizationRequest);

module.exports = router;
