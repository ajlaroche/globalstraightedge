const router = require("express").Router();
const lendingClubSummaryController = require("../../controllers/lendingClubSummaryController");
const lendingClubMetricsController = require("../../controllers/lendingClubMetricsController");

// Matches with "/api/lcsummaryrecord"
router
  .route("/")
  .get(lendingClubSummaryController.findAll)
  .post(lendingClubSummaryController.create);

router
  .route("/makeup")
  .get(lendingClubMetricsController.findAll)
  .post(lendingClubMetricsController.create);

module.exports = router;
