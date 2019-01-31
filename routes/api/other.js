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

        console.log(found.myNotes.length);

        found.myNotes.forEach((element, index) => {
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
                      // console.log(index);
                      countUpdated += 1;
                    })
                    .catch(err => console.log(err));
                } else if (result.length == 0) {
                  db.LendingClubPortfolio.create(noteData)
                    .then(createResult => {
                      countCreated += 1;
                      console.log(`note ID ${element.noteId} created`);
                    })
                    .catch(err => console.log(err));
                }
              } else {
                db.LendingClubPortfolio.create(noteData)
                  .then(createResult =>
                    console.log(`note ID ${element.noteId} created`)
                  )
                  .catch(err => console.log(err));
              }
            })
            .catch(err => console.log(err));
          // if (index + 1 == found.myNotes.length) {
          //   console.log(
          //     countFullyPaid + " notes are fully paid",
          //     countUpdated + " notes have been udpated"
          //   );
          // }
        });
      } else {
        console.log(error);
        found = {};
      }
    }
  );
}
module.exports = router;
