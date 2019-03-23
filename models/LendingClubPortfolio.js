const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lcPortfolioSchema = new Schema({
  investorId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  loanStatus: { type: String, required: true },
  loanId: { type: Number, required: true },
  portfolioName: { type: String, required: false },
  noteId: { type: Number, required: true },
  grade: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  accruedInterest: { type: Number, required: true },
  noteAmount: { type: Number, required: true },
  purpose: { type: String, required: true },
  interestRate: { type: Number, required: true },
  orderId: { type: Number, required: true },
  loanLength: { type: Number, required: true },
  issueDate: { type: String, required: false },
  orderDate: { type: String, required: true },
  loanStatusDate: { type: String, required: true },
  age: { type: Number, required: true },
  creditTrend: { type: String, required: true },
  currentPaymentStatus: { type: String, required: false },
  paymentsReceived: { type: Number, required: true },
  nextPaymentDate: { type: String, required: false },
  principalPending: { type: Number, required: true },
  interestPending: { type: Number, required: true },
  principalReceived: { type: Number, required: true },
  interestReceived: { type: Number, required: true },
  applicationType: { type: String, required: false },
  disbursementMethod: { type: String, required: true }
});

const LendingClubPortfolio = mongoose.model(
  "LendingClubPortfolio",
  lcPortfolioSchema
);

module.exports = LendingClubPortfolio;
