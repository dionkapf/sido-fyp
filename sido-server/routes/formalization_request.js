let express = require("express");
let router = express.Router();
const {
  getFormalizationRequest,
  getFormalizationRequests,
  createFormalizationRequest,
  updateFormalizationRequest,
} = require("../controllers/formalization_request");
const { createDocument } = require("../middleware/generate-doc");

router
  .route("/")
  .get(getFormalizationRequests)
  .post(createFormalizationRequest);
router
  .route("/:id")
  .get(getFormalizationRequest)
  .put(updateFormalizationRequest);

router.route("/:id/create-doc").post(createDocument);

module.exports = router;
