require("dotenv").config();
const router = require("express").Router();
const request = require("request");
const keys = require("../../keys.js");
const db = require("../../models");
const moment = require("moment-timezone");

const lendingClubAPI = keys.lendingClub.API;

router.route("/lcsummary").get(function(req, res) {
  request(
    {
      url:
        "https://api.lendingclub.com/api/investor/v1/accounts/372299/summary",
      headers: { Authorization: lendingClubAPI }
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const found = JSON.parse(body);
        res.json(found);
        // console.log(found);
      } else {
        console.log(error);
        found = {};
      }
    }
  );
});

// Function to get daily lending club record, check if last record was sent to database more than 24 hours ago; if so, send a new record to the database

getLendingClubSummary();
setInterval(getLendingClubSummary, 86400000); // Run every 24 hours

function getLendingClubSummary() {
  request(
    {
      url:
        "https://api.lendingclub.com/api/investor/v1/accounts/372299/summary",
      headers: { Authorization: lendingClubAPI }
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const found = JSON.parse(body);
        const currentDate = moment().format();
        let lendingClubSummary = {
          investorId: found.investorId,
          date: currentDate,
          availableCash: found.availableCash,
          accountTotal: found.accountTotal,
          accruedInterest: found.accruedInterest,
          inFundingBalance: found.infundingBalance,
          receivedInterest: found.receivedInterest,
          receivedPrincipal: found.receivedPrincipal,
          receivedLateFees: found.receivedLateFees,
          outstandingPrincipal: found.outstandingPrincipal,
          totalNotes: found.totalNotes,
          primaryNAR: found.netAnnualizedReturn.primaryNAR,
          primaryAdjustedNAR: found.netAnnualizedReturn.primaryAdjustedNAR,
          primaryUserAdjustedNAR:
            found.netAnnualizedReturn.primaryUserAdjustedNAR,
          tradedNAR: found.netAnnualizedReturn.tradedNAR,
          tradedAjustedNAR: found.netAnnualizedReturn.tradedAdjustedNAR,
          tradedUserAdjustedNAR:
            found.netAnnualizedReturn.tradedUserAdjustedNAR,
          combinedNAR: found.netAnnualizedReturn.combinedNAR,
          combinedAdjustedNAR: found.netAnnualizedReturn.combinedAdjustedNAR,
          combineduserAdjustedNAR:
            found.netAnnualizedReturn.combinedUserAdjustedNAR,
          adjustmentForPastDueNotes: found.adjustments.adjustmentForPastDueNotes
        };
        // console.log(lendingClubSummary);

        db.LendingClubSummary.find()
          .sort({ date: -1 })
          .then(dbModel => {
            if (dbModel.length > 0) {
              const lastRecordDate = dbModel[0].date;
              const hoursSinceLastRecord = moment().diff(
                lastRecordDate,
                "hours"
              );
              console.log(hoursSinceLastRecord);
              if (hoursSinceLastRecord > 22) {
                db.LendingClubSummary.create(lendingClubSummary)
                  .then(record => {
                    console.log("LendingClubSummary saved");
                  })
                  .catch(err => console.log(err));
              } else {
                console.log("Lending club summary database is up to date");
              }
            } else {
              db.LendingClubSummary.create(lendingClubSummary)
                .then(record => {
                  console.log("LendingClubSummary saved");
                })
                .catch(err => console.log(err));
            }
          });
      } else {
        console.log(error);
        found = {};
      }
    }
  );
}

// Function gets notes portfolio and makes updates every 24 hours

getLendingClubPortfolio();
setInterval(getLendingClubPortfolio, 86400000); // Run every 24 hours

function getLendingClubPortfolio() {
  const portfolioCompCount = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0 };
  const portfolioCompCapital = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0 };
  const portfolioChargedOff = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0 };
  const portfolioNoteLength = { short: 0, long: 0 };
  const portfolioNoteStatus = {
    "Fully Paid": 0,
    "Charged Off": 0,
    Current: 0,
    "Late (31-120 days)": 0,
    "Late (16-30 days)": 0,
    Default: 0,
    "In Grace Period": 0,
    Issued: 0,
    "In Review": 0,
    "In Funding": 0
  };
  const portfolioNotePurpose = {
    "Debt consolidation": 0,
    "Credit card refinancing": 0,
    Business: 0,
    "Medical expenses": 0,
    Other: 0,
    "Home improvement": 0,
    "Car financing": 0,
    "Learning and training": 0,
    "Major purchase": 0,
    "Green loan": 0,
    "Home buying": 0,
    "Moving and relocation": 0,
    Vacation: 0
  };
  let principalInvested = 0;
  let principalInvestedActive = 0;
  let principalPendingChargedOff = 0;
  let countChargedOff = 0;
  let chargeOffTerm = { short: 0, long: 0 };
  const chargeOffNotePurpose = {
    "Debt consolidation": 0,
    "Credit card refinancing": 0,
    Business: 0,
    "Medical expenses": 0,
    Other: 0,
    "Home improvement": 0,
    "Car financing": 0,
    "Learning and training": 0,
    "Major purchase": 0,
    "Green loan": 0,
    "Home buying": 0,
    "Moving and relocation": 0,
    Vacation: 0
  };

  const chargeOffAge = {
    age_0to6: 0,
    age_6to12: 0,
    age_12to18: 0,
    age_18to24: 0,
    age_24to30: 0,
    age_30to36: 0,
    age_36Plus: 0
  };

  const activeAge = {
    age_0to6: 0,
    age_6to12: 0,
    age_12to18: 0,
    age_18to24: 0,
    age_24to30: 0,
    age_30to36: 0,
    age_36Plus: 0
  };

  const roiDistribution = {
    roi_10minus: 0,
    roi_minus10to5: 0,
    roi_minus5to0: 0,
    roi_0to5: 0,
    roi_5to10: 0,
    roi_10to15: 0,
    roi_15plus: 0
  };

  const sumROIbyGrade = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0 };
  const sumROIDenominator = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0 };

  request(
    {
      url:
        "https://api.lendingclub.com/api/investor/v1/accounts/372299/detailednotes",
      headers: { Authorization: lendingClubAPI }
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const found = JSON.parse(body);
        const currentDate = moment().format();
        let countUpdated = 0;
        let countFullyPaid = 0;
        let countCreated = 0;
        let countElements = 0;
        const totalNoteCount = found.myNotes.length;

        console.log(found.myNotes.length);

        found.myNotes.forEach(element => {
          let age = 0;
          let roi = 0;

          if (
            element.loanStatus === "In Review" ||
            element.loanStatus === "In Funding"
          ) {
            age = 0;
            roi = 0;
          } else {
            if (
              element.loanStatus === "Issued" ||
              element.loanStatus === "Current"
            ) {
              age = moment().diff(element.issueDate, "days", true);
            } else {
              age = moment(element.loanStatusDate).diff(
                element.issueDate,
                "days",
                true
              );
            }

            if (element.loanStatus !== "Charged Off" && age > 365) {
              roi =
                Math.pow(
                  (element.principalPending + element.paymentsReceived) /
                    element.noteAmount,
                  365 / age
                ) - 1;
            } else if (
              element.loanStatus !== "Charged Off" &&
              age <= 365 &&
              age > 0
            ) {
              roi = element.interestReceived / element.noteAmount;
            } else {
              if (element.loanStatus === "Issued") {
                roi = 0;
              } else {
                if (age > 0 && element.noteAmount !== 0) {
                  if (
                    element.noteAmount >= element.principalPending &&
                    element.paymentsReceived < element.noteAmount
                  ) {
                    roi =
                      Math.pow(
                        1 +
                          (element.interestReceived -
                            element.principalPending) /
                            element.noteAmount,
                        365 / age
                      ) - 1;
                  } else {
                    if (
                      element.noteAmount >= element.principalPending &&
                      element.paymentsReceived > element.noteAmount
                    ) {
                      roi =
                        Math.pow(
                          element.paymentsReceived / element.noteAmount,
                          365 / age
                        ) - 1;
                    } else {
                      roi =
                        Math.pow(
                          1 +
                            (element.paymentsReceived - element.noteAmount) /
                              element.noteAmount,
                          365 / age
                        ) - 1;
                    }
                  }
                } else {
                  roi = 0;
                }
              }
            }
          }

          let noteData = {
            investorId: 372299,
            date: currentDate,
            loanStatus: element.loanStatus,
            loanId: element.loanId,
            portfolioName: element.portfolioName,
            noteId: element.noteId,
            grade: element.grade,
            loanAmount: element.loanAmount,
            accruedInterest: element.accruedInterest,
            noteAmount: element.noteAmount,
            purpose: element.purpose,
            interestRate: element.interestRate,
            orderId: element.orderId,
            loanLength: element.loanLength,
            issueDate: element.issueDate,
            orderDate: element.orderDate,
            loanStatusDate: element.loanStatusDate,
            age: age,
            roi: roi,
            creditTrend: element.creditTrend,
            currentPaymentStatus: element.currentPaymentStatus,
            paymentsReceived: element.paymentsReceived,
            nextPaymentDate: element.nextPaymentDate,
            principalPending: element.principalPending,
            interestPending: element.interestPending,
            principalReceived: element.principalReceived,
            interestReceived: element.interestReceived,
            applicationType: element.applicationType,
            disbursementMethod: element.disbursementMethod
          };

          // Count the number of notes that are fully paid
          if (element.loanStatus === "Fully Paid") {
            countFullyPaid += 1;
            countElements += 1;
            printPortfolioUpdateResults(
              countElements,
              totalNoteCount,
              countFullyPaid,
              countUpdated,
              portfolioCompCapital,
              portfolioCompCount,
              portfolioNoteLength,
              portfolioNoteStatus,
              portfolioNotePurpose,
              portfolioChargedOff,
              principalInvested,
              principalInvestedActive,
              principalPendingChargedOff,
              countChargedOff,
              chargeOffTerm,
              chargeOffNotePurpose,
              chargeOffAge,
              activeAge,
              roiDistribution,
              sumROIbyGrade,
              sumROIDenominator
            );
          }
          // Check if notes already exist in the database; if so, update note data.  If not, create a new note.
          db.LendingClubPortfolio.find({ noteId: element.noteId })
            .then(result => {
              let hoursSinceLastRecordUpdate = 0;
              if (result.length > 0) {
                hoursSinceLastRecordUpdate = moment().diff(
                  result[0].date,
                  "hours"
                );
              } else {
                hoursSinceLastRecordUpdate = 0;
              }
              if (found.myNotes.length > 0) {
                // Check if database is not empty first
                if (
                  result.length > 0 &&
                  hoursSinceLastRecordUpdate > 18 &&
                  element.loanStatus !== "Fully Paid"
                ) {
                  db.LendingClubPortfolio.findOneAndUpdate(
                    { noteId: element.noteId },
                    noteData
                  )
                    .then(updateResult => {
                      // console.log(`note ID ${element.noteId} was updated`);
                      countUpdated += 1;
                      countElements += 1;
                      printPortfolioUpdateResults(
                        countElements,
                        totalNoteCount,
                        countFullyPaid,
                        countUpdated,
                        portfolioCompCapital,
                        portfolioCompCount,
                        portfolioNoteLength,
                        portfolioNoteStatus,
                        portfolioNotePurpose,
                        portfolioChargedOff,
                        principalInvested,
                        principalInvestedActive,
                        principalPendingChargedOff,
                        countChargedOff,
                        chargeOffTerm,
                        chargeOffNotePurpose,
                        chargeOffAge,
                        activeAge,
                        roiDistribution,
                        sumROIbyGrade,
                        sumROIDenominator
                      );
                    })
                    .catch(err => console.log(err));
                } else if (result.length == 0) {
                  db.LendingClubPortfolio.create(noteData)
                    .then(createResult => {
                      countCreated += 1;
                      countElements += 1;
                      // console.log(`note ID ${element.noteId} created`);
                      printPortfolioUpdateResults(
                        countElements,
                        totalNoteCount,
                        countFullyPaid,
                        countUpdated,
                        portfolioCompCapital,
                        portfolioCompCount,
                        portfolioNoteLength,
                        portfolioNoteStatus,
                        portfolioNotePurpose,
                        portfolioChargedOff,
                        principalInvested,
                        principalInvestedActive,
                        principalPendingChargedOff,
                        countChargedOff,
                        chargeOffTerm,
                        chargeOffNotePurpose,
                        chargeOffAge,
                        activeAge,
                        roiDistribution,
                        sumROIbyGrade,
                        sumROIDenominator
                      );
                    })
                    .catch(err => console.log(err));
                }

                // Count all other notes
                if (
                  result.length > 0 &&
                  hoursSinceLastRecordUpdate <= 18 &&
                  element.loanStatus !== "Fully Paid"
                ) {
                  countElements += 1;
                  printPortfolioUpdateResults(
                    countElements,
                    totalNoteCount,
                    countFullyPaid,
                    countUpdated,
                    portfolioCompCapital,
                    portfolioCompCount,
                    portfolioNoteLength,
                    portfolioNoteStatus,
                    portfolioNotePurpose,
                    portfolioChargedOff,
                    principalInvested,
                    principalInvestedActive,
                    principalPendingChargedOff,
                    countChargedOff,
                    chargeOffTerm,
                    chargeOffNotePurpose,
                    chargeOffAge,
                    activeAge,
                    roiDistribution,
                    sumROIbyGrade,
                    sumROIDenominator
                  );
                }
              } else {
                db.LendingClubPortfolio.create(noteData)
                  .then(createResult =>
                    console.log(`note ID ${element.noteId} created`)
                  )
                  .catch(err => console.log(err));
              }

              // Categorize chargeoffs by age
              if (element.loanStatus === "Charged Off" && result.length > 0) {
                let ageMonths = Math.round(result[0].age / 30);
                // console.log(result[0].age / 30);
                switch (true) {
                  case ageMonths < 6:
                    chargeOffAge.age_0to6 += 1;
                    break;
                  case ageMonths >= 6 && ageMonths < 12:
                    chargeOffAge.age_6to12 += 1;
                    break;
                  case ageMonths >= 12 && ageMonths < 18:
                    chargeOffAge.age_12to18 += 1;
                    break;
                  case ageMonths >= 18 && ageMonths < 24:
                    chargeOffAge.age_18to24 += 1;
                    break;
                  case ageMonths >= 24 && ageMonths < 30:
                    chargeOffAge.age_24to30 += 1;
                    break;
                  case ageMonths >= 30 && ageMonths < 36:
                    chargeOffAge.age_30to36 += 1;
                    break;
                  case ageMonths >= 36:
                    chargeOffAge.age_36Plus += 1;
                    break;
                  default:
                    break;
                }
              }

              // Categorize active notes by age
              if (
                element.loanStatus !== "Charged Off" &&
                element.loanStatus !== "In Review" &&
                element.loanStatus !== "In Funding" &&
                element.loanStatus !== "Fully Paid" &&
                result.length > 0
              ) {
                let activeAgeMonths = result[0].age / 30;
                // console.log(result[0].age);
                switch (true) {
                  case activeAgeMonths < 6:
                    activeAge.age_0to6 += 1;
                    break;
                  case activeAgeMonths >= 6 && activeAgeMonths < 12:
                    activeAge.age_6to12 += 1;
                    break;
                  case activeAgeMonths >= 12 && activeAgeMonths < 18:
                    activeAge.age_12to18 += 1;
                    break;
                  case activeAgeMonths >= 18 && activeAgeMonths < 24:
                    activeAge.age_18to24 += 1;
                    break;
                  case activeAgeMonths >= 24 && activeAgeMonths < 30:
                    activeAge.age_24to30 += 1;
                    break;
                  case activeAgeMonths >= 30 && activeAgeMonths < 36:
                    activeAge.age_30to36 += 1;
                    break;
                  case activeAgeMonths >= 36:
                    activeAge.age_36Plus += 1;
                    break;
                  default:
                    break;
                }
              }

              // Categorize by roi
              if (roi !== 0) {
                switch (true) {
                  case roi < -0.1:
                    roiDistribution.roi_10minus += 1;
                    break;
                  case roi >= -0.1 && roi < -0.05:
                    roiDistribution.roi_minus10to5 += 1;
                    break;
                  case roi >= -0.05 && roi < 0:
                    roiDistribution.roi_minus5to0 += 1;
                    break;
                  case roi >= 0 && roi < 0.05:
                    roiDistribution.roi_0to5 += 1;
                    break;
                  case roi >= 0.05 && roi < 0.1:
                    roiDistribution.roi_5to10 += 1;
                    break;
                  case roi >= 0.1 && roi < 0.15:
                    roiDistribution.roi_10to15 += 1;
                    break;
                  case roi >= 0.15:
                    roiDistribution.roi_15plus += 1;
                    break;
                  default:
                    break;
                }
              }
            })
            .catch(err => console.log(err));

          // Update historical portfolio metrics
          if (element.loanLength === 36) {
            portfolioNoteLength.short += element.noteAmount;
          } else {
            portfolioNoteLength.long += element.noteAmount;
          }

          portfolioCompCount[element.grade.charAt(0)] += 1;
          portfolioCompCapital[element.grade.charAt(0)] += element.noteAmount;

          let status = element.loanStatus;
          let lostFactor = 0;

          switch (status) {
            case "Current":
              lostFactor = 0;
              break;
            case "In Grace Period":
              lostFactor = 0.22;
              break;
            case "Late (16-30 days)":
              lostFactor = 0.5;
              break;
            case "Late (31-120 days)":
              lostFactor = 0.75;
              break;
            case "Default":
              lostFactor = 0.72;
              break;
            case "Charged Off":
              lostFactor = 1;
              break;
            default:
              lostFactor = 0;
          }
          // Calculate the numerator and denominator ROI average by grade
          sumROIbyGrade[element.grade.charAt(0)] +=
            element.interestReceived +
            (element.paymentsReceived -
              element.interestReceived -
              element.principalReceived) -
            0.01 * element.paymentsReceived -
            lostFactor * element.principalPending;

          sumROIDenominator[element.grade.charAt(0)] +=
            element.interestReceived / (element.interestRate / 100);

          if (element.loanStatus === "Charged Off") {
            portfolioChargedOff[element.grade.charAt(0)] +=
              element.principalPending;
            countChargedOff += 1;
            principalPendingChargedOff += element.principalPending;
            chargeOffNotePurpose[element.purpose] += element.principalPending;
            if (element.loanLength === 36) {
              chargeOffTerm.short += element.principalPending;
            } else {
              chargeOffTerm.long += element.principalPending;
            }
          }

          if (
            element.loanStatus !== "Charged Off" &&
            element.loanStatus !== "Fully Paid"
          ) {
            principalInvestedActive += element.noteAmount;
          }

          portfolioNoteStatus[element.loanStatus] += element.principalPending;
          portfolioNotePurpose[element.purpose] += element.principalPending;

          principalInvested += element.noteAmount;
        });
      } else {
        console.log(error);
        found = {};
      }
    }
  );
}

// Action to take once all notes have cycled through
function printPortfolioUpdateResults(
  countElements,
  totalNoteCount,
  countFullyPaid,
  countUpdated,
  portfolioCompCapital,
  portfolioCompCount,
  portfolioNoteLength,
  portfolioNoteStatus,
  portfolioNotePurpose,
  portfolioChargedOff,
  principalInvested,
  principalInvestedActive,
  principalPendingChargedOff,
  countChargedOff,
  chargeOffTerm,
  chargeOffNotePurpose,
  chargeOffAge,
  activeAge,
  roiDistribution,
  sumROIbyGrade,
  sumROIDenominator
) {
  if (countElements === totalNoteCount) {
    console.log(
      countFullyPaid + " notes are fully paid \n",
      countUpdated + " notes have been udpated"
    );
    // console.log(portfolioNoteStatus);
    // console.log(portfolioNotePurpose);

    const metricsData = {
      date: moment().format(),
      Acount: portfolioCompCount.A,
      Bcount: portfolioCompCount.B,
      Ccount: portfolioCompCount.C,
      Dcount: portfolioCompCount.D,
      Ecount: portfolioCompCount.E,
      Fcount: portfolioCompCount.F,
      Gcount: portfolioCompCount.G,
      Avalue: portfolioCompCapital.A,
      Bvalue: portfolioCompCapital.B,
      Cvalue: portfolioCompCapital.C,
      Dvalue: portfolioCompCapital.D,
      Evalue: portfolioCompCapital.E,
      Fvalue: portfolioCompCapital.F,
      Gvalue: portfolioCompCapital.G,
      principalInvested: principalInvested,
      principalInvestedActive: principalInvestedActive,
      numberActiveNotes: totalNoteCount - countFullyPaid - countChargedOff,
      principalPendingChargedOff: principalPendingChargedOff,
      countChargedOff: countChargedOff,
      AchargedOff: portfolioChargedOff.A,
      BchargedOff: portfolioChargedOff.B,
      CchargedOff: portfolioChargedOff.C,
      DchargedOff: portfolioChargedOff.D,
      EchargedOff: portfolioChargedOff.E,
      FchargedOff: portfolioChargedOff.F,
      GchargedOff: portfolioChargedOff.G,
      shortLengthChargedOff: chargeOffTerm.short,
      longLengthChargedOff: chargeOffTerm.long,
      shortLength: portfolioNoteLength.short,
      longLength: portfolioNoteLength.long,
      chargedOff: portfolioNoteStatus["Charged Off"],
      current: portfolioNoteStatus.Current,
      late31to120: portfolioNoteStatus["Late (31-120 days)"],
      late16to30: portfolioNoteStatus["Late (16-30 days)"],
      defaulted: portfolioNoteStatus.Default,
      gracePeriod: portfolioNoteStatus["In Grace Period"],
      issued: portfolioNoteStatus.Issued,
      inReview: portfolioNoteStatus["In Review"],
      inFunding: portfolioNoteStatus["In Funding"],
      debtConsolidation: portfolioNotePurpose["Debt consolidation"],
      creditCard: portfolioNotePurpose["Credit card refinancing"],
      business: portfolioNotePurpose.Business,
      medical: portfolioNotePurpose["Medical expenses"],
      other: portfolioNotePurpose.Other,
      homeImprovement: portfolioNotePurpose["Home improvement"],
      carFinancing: portfolioNotePurpose["Car financing"],
      education: portfolioNotePurpose["Learning and training"],
      majorPurchase: portfolioNotePurpose["Major purchase"],
      greenLoan: portfolioNotePurpose["Green loan"],
      homeBuying: portfolioNotePurpose["Home buying"],
      moving: portfolioNotePurpose["Moving and relocation"],
      vacation: portfolioNotePurpose.Vacation,
      chargeOffDebtConsolidation: chargeOffNotePurpose["Debt consolidation"],
      chargeOffCreditCard: chargeOffNotePurpose["Credit card refinancing"],
      chargeOffBusiness: chargeOffNotePurpose.Business,
      chargeOffMedical: chargeOffNotePurpose["Medical expenses"],
      chargeOffOther: chargeOffNotePurpose.Other,
      chargeOffHomeImprovement: chargeOffNotePurpose["Home improvement"],
      chargeOffCarFinancing: chargeOffNotePurpose["Car financing"],
      chargeOffEducation: chargeOffNotePurpose["Learning and training"],
      chargeOffMajorPurchase: chargeOffNotePurpose["Major purchase"],
      chargeOffGreenLoan: chargeOffNotePurpose["Green loan"],
      chargeOffHomeBuying: chargeOffNotePurpose["Home buying"],
      chargeOffMoving: chargeOffNotePurpose["Moving and relocation"],
      chargeOffVacation: chargeOffNotePurpose.Vacation,
      chargedOff_0to6: chargeOffAge.age_0to6,
      chargedOff_6to12: chargeOffAge.age_6to12,
      chargedOff_12to18: chargeOffAge.age_12to18,
      chargedOff_18to24: chargeOffAge.age_18to24,
      chargedOff_24to30: chargeOffAge.age_24to30,
      chargedOff_30to36: chargeOffAge.age_30to36,
      chargedOff_36Plus: chargeOffAge.age_36Plus,
      activeAge_0to6: activeAge.age_0to6,
      activeAge_6to12: activeAge.age_6to12,
      activeAge_12to18: activeAge.age_12to18,
      activeAge_18to24: activeAge.age_18to24,
      activeAge_24to30: activeAge.age_24to30,
      activeAge_30to36: activeAge.age_30to36,
      activeAge_36Plus: activeAge.age_36Plus,
      roi_10minus: roiDistribution.roi_10minus,
      roi_minus10to5: roiDistribution.roi_minus10to5,
      roi_minus5to0: roiDistribution.roi_minus5to0,
      roi_0to5: roiDistribution.roi_0to5,
      roi_5to10: roiDistribution.roi_5to10,
      roi_10to15: roiDistribution.roi_10to15,
      roi_15plus: roiDistribution.roi_15plus,
      roi_AsumProduct: sumROIbyGrade.A / sumROIDenominator.A,
      roi_BsumProduct: sumROIbyGrade.B / sumROIDenominator.B,
      roi_CsumProduct: sumROIbyGrade.C / sumROIDenominator.C,
      roi_DsumProduct: sumROIbyGrade.D / sumROIDenominator.D,
      roi_EsumProduct: sumROIbyGrade.E / sumROIDenominator.E,
      roi_FsumProduct: sumROIbyGrade.F / sumROIDenominator.F,
      roi_GsumProduct: sumROIbyGrade.G / sumROIDenominator.G
    };

    db.LendingClubMetrics.find()
      .sort({ date: -1 })
      .then(dbModel => {
        if (dbModel.length > 0) {
          const lastRecordDate = dbModel[0].date;
          const hoursSinceLastRecord = moment().diff(lastRecordDate, "hours");
          console.log(hoursSinceLastRecord);
          if (hoursSinceLastRecord > 22) {
            db.LendingClubMetrics.create(metricsData)
              .then(record => {
                console.log("LendingClubMetrics saved");
              })
              .catch(err => console.log(err));
          } else {
            console.log("Lending Club Metrics database is up to date");
          }
        } else {
          db.LendingClubMetrics.create(metricsData)
            .then(record => {
              console.log("LendingClubMetrics saved");
            })
            .catch(err => console.log(err));
        }
      });
  }
}
module.exports = router;
