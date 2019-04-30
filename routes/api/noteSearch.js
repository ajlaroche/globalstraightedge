const router = require("express").Router();
const lendingClubPortfolioController = require("../../controllers/LendingClubPortfolioController");

// Matches with "/api/notesearch"
router.route("/").get(lendingClubPortfolioController.findGrade);

// router
//   .route("/makeup")
//   .get(lendingClubMetricsController.findAll)
//   .post(lendingClubMetricsController.create);

module.exports = router;
