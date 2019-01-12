const path = require("path");
const router = require("express").Router();
const marketdataRoutes = require("./marketdata");
const economyRoutes = require("./economy");
const otherRoutes = require("./other");

router.use("/marketdata", marketdataRoutes);
router.use("/economy", economyRoutes);
router.use("/other", otherRoutes);

module.exports = router;
