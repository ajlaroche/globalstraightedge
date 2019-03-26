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
  principalInvested: { type: Number, required: true },
  numberActiveNotes: { type: Number, required: true },
  principalInvestedActive: { type: Number, required: true },
  principalPendingChargedOff: { type: Number, required: true },
  countChargedOff: { type: Number, required: true },
  AchargedOff: { type: Number, required: true },
  BchargedOff: { type: Number, required: true },
  CchargedOff: { type: Number, required: true },
  DchargedOff: { type: Number, required: true },
  EchargedOff: { type: Number, required: true },
  FchargedOff: { type: Number, required: true },
  GchargedOff: { type: Number, required: true },
  shortLength: { type: Number, required: true },
  longLength: { type: Number, required: true },
  shortLengthChargedOff: { type: Number, required: true },
  longLengthChargedOff: { type: Number, required: true },
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
  vacation: { type: Number, required: true },
  //Charge Offs
  chargeOffDebtConsolidation: { type: Number, required: true },
  chargeOffCreditCard: { type: Number, required: true },
  chargeOffBusiness: { type: Number, required: true },
  chargeOffMedical: { type: Number, required: true },
  chargeOffOther: { type: Number, required: true },
  chargeOffHomeImprovement: { type: Number, required: true },
  chargeOffCarFinancing: { type: Number, required: true },
  chargeOffEducation: { type: Number, required: true },
  chargeOffMajorPurchase: { type: Number, required: true },
  chargeOffGreenLoan: { type: Number, required: true },
  chargeOffHomeBuying: { type: Number, required: true },
  chargeOffMoving: { type: Number, required: true },
  chargeOffVacation: { type: Number, required: true },
  chargedOff_0to6: { type: Number, required: true },
  chargedOff_6to12: { type: Number, required: true },
  chargedOff_12to18: { type: Number, required: true },
  chargedOff_18to24: { type: Number, required: true },
  chargedOff_24to30: { type: Number, required: true },
  chargedOff_30to36: { type: Number, required: true },
  chargedOff_36Plus: { type: Number, required: true }
});

const LendingClubMetrics = mongoose.model(
  "LendingClubMetrics",
  lcMetricsSchema
);

module.exports = LendingClubMetrics;
