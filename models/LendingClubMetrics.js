const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lcMetricsSchema = new Schema({
  date: { type: Date, default: Date.now },
  Acount: { type: Number, required: true },
  Bcount: { type: Number, required: true },
  Ccount: { type: Number, required: true },
  Dcount: { type: Number, required: true },
  Ecount: { type: Number, required: true },
  Fcount: { type: Number, required: true },
  Gcount: { type: Number, required: true },
  Avalue: { type: Number, required: true },
  Bvalue: { type: Number, required: true },
  Cvalue: { type: Number, required: true },
  Dvalue: { type: Number, required: true },
  Evalue: { type: Number, required: true },
  Fvalue: { type: Number, required: true },
  Gvalue: { type: Number, required: true }
});

const LendingClubMetrics = mongoose.model(
  "LendingClubMetrics",
  lcMetricsSchema
);

module.exports = LendingClubMetrics;
