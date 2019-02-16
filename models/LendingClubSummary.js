const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lendingClubSchema = new Schema({
  investorId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  availableCash: { type: Number, required: true },
  accountTotal: { type: Number, required: true },
  accruedInterest: { type: Number, required: true },
  inFundingBalance: { type: Number, required: true },
  receivedInterest: { type: Number, required: true },
  receivedPrincipal: { type: Number, required: true },
  receivedLateFees: { type: Number, required: true },
  outstandingPrincipal: { type: Number, required: true },
  totalNotes: { type: Number, required: true },
  primaryNAR: { type: Number, required: true },
  primaryAdjustedNAR: { type: Number, required: true },
  primaryUserAdjustedNAR: { type: Number, required: true },
  tradedNAR: { type: Number, required: true },
  tradedAjustedNAR: { type: Number, required: true },
  tradedUserAdjustedNAR: { type: Number, required: true },
  combinedNAR: { type: Number, required: true },
  combinedAdjustedNAR: { type: Number, required: true },
  combineduserAdjustedNAR: { type: Number, required: true },
  adjustmentForPastDueNotes: { type: Number, required: true }
});

const LendingClubSummary = mongoose.model(
  "LendingClubSummary",
  lendingClubSchema
);

module.exports = LendingClubSummary;
