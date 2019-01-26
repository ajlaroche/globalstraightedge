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

getLendingClubSummary();

// Function to get daily lending club record, check if last record was sent to database more than 24 hours ago; if so, send a new record to the database

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

module.exports = router;
