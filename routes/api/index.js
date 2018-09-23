const router = require("express").Router();
const marketdataRoutes = require("./api");

router.use("/marketdata", marketdataRoutes);

module.exports = router;
