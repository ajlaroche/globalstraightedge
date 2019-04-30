const path = require("path");
const router = require("express").Router();
const marketdataRoutes = require("./marketdata");
const economyRoutes = require("./economy");
const otherRoutes = require("./other");
const lcSummaryRoutes = require("./lcsummaryrecord");
const noteSearchRoutes = require("./noteSearch");

router.use("/marketdata", marketdataRoutes);
router.use("/economy", economyRoutes);
router.use("/other", otherRoutes);
router.use("/lcsummaryrecord", lcSummaryRoutes);
router.use("/notesearch", noteSearchRoutes);

module.exports = router;
