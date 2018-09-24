const path = require("path");
const router = require("express").Router();
const marketdataRoutes = require("./marketdata");

router.use("/marketdata", marketdataRoutes);

module.exports = router;
