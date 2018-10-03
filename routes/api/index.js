const path = require("path");
const router = require("express").Router();
const marketdataRoutes = require("./marketdata");
const economyRoutes = require("./economy");

router.use("/marketdata", marketdataRoutes);
router.use("/economy", economyRoutes);

module.exports = router;
