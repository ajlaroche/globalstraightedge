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
  Gvalue: { type: Number, required: true },
  AchargedOff: { type: Number, required: true },
  BchargedOff: { type: Number, required: true },
  CchargedOff: { type: Number, required: true },
  DchargedOff: { type: Number, required: true },
  EchargedOff: { type: Number, required: true },
  FchargedOff: { type: Number, required: true },
  GchargedOff: { type: Number, required: true },
  shortLength: { type: Number, required: true },
  longLength: { type: Number, required: true },
  chargedOff: { type: Number, required: true },
  current: { type: Number, required: true },
  late31to120: { type: Number, required: true },
  late16to30: { type: Number, required: true },
  defaulted: { type: Number, required: true },
  gracePeriod: { type: Number, required: true },
  issued: { type: Number, required: true },
  inReview: { type: Number, required: true },
  inFunding: { type: Number, required: true },
  debtConsolidation: { type: Number, required: true },
  creditCard: { type: Number, required: true },
  business: { type: Number, required: true },
  medical: { type: Number, required: true },
  other: { type: Number, required: true },
  homeImprovement: { type: Number, required: true },
  carFinancing: { type: Number, required: true },
  education: { type: Number, required: true },
  majorPurchase: { type: Number, required: true },
  greenLoan: { type: Number, required: true },
  homeBuying: { type: Number, required: true },
  moving: { type: Number, required: true },
  vacation: { type: Number, required: true }
});

const LendingClubMetrics = mongoose.model(
  "LendingClubMetrics",
  lcMetricsSchema
);

module.exports = LendingClubMetrics;
