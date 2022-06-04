let express = require("express");
let router = express.Router();
const {
  getFormalizationRequest,
  getFormalizationRequests,
  createFormalizationRequest,
  updateFormalizationRequest,
} = require("../controllers/formalization_request");

router
  .route("/")
  .get(getFormalizationRequests)
  .post(createFormalizationRequest);
router
  .route("/:id")
  .get(getFormalizationRequest)
  .put(updateFormalizationRequest);

module.exports = router;
