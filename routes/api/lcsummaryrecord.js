const router = require("express").Router();
const lendingClubSummaryController = require("../../controllers/lendingClubSummaryController");

// Matches with "/api/lcsummaryrecord"
router
  .route("/")
  .get(lendingClubSummaryController.findAll)
  .post(lendingClubSummaryController.create);

module.exports = router;
