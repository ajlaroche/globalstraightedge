import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import Highcharts from "highcharts";
import moment from "moment-timezone";

class LendingClub extends Component {
  constructor(props) {
    super(props);

    this.getSummary = this.getSummary.bind(this);

    this.state = {
      lendingClubSummary: {
        investorId: 372299,
        date: Date.now,
        availableCash: 0,
        accountTotal: 0,
        accruedInterest: 0,
        inFundingBalance: 0,
        receivedInterest: 0,
        receivedPrincipal: 0,
        receivedLateFees: 0,
        outstandingPrincipal: 0,
        totalNotes: 0,
        primaryNAR: 0,
        primaryAdjustedNAR: 0,
        primaryUserAdjustedNAR: 0,
        tradedNAR: 0,
        tradedAjustedNAR: 0,
        tradedUserAdjustedNAR: 0,
        combinedNAR: 0,
        combinedAdjustedNAR: 0,
        combineduserAdjustedNAR: 0,
        adjustmentForPastDueNotes: 0
      }
    };
  }

  componentDidMount() {
    this.getSummary();
  }

  getSummary() {
    API.getLendingClubSummary()
      .then(res => {
        console.log(res.data);
        const currentDate = moment().format();
        this.setState({
          lendingClubSummary: {
            investorId: res.data.investorId,
            date: currentDate,
            availableCash: res.data.availableCash,
            accountTotal: res.data.accountTotal,
            accruedInterest: res.data.accruedInterest,
            inFundingBalance: res.data.infundingBalance,
            receivedInterest: res.data.receivedInterest,
            receivedPrincipal: res.data.receivedPrincipal,
            receivedLateFees: res.data.receivedLateFees,
            outstandingPrincipal: res.data.outstandingPrincipal,
            totalNotes: res.data.totalNotes,
            primaryNAR: res.data.netAnnualizedReturn.primaryNAR,
            primaryAdjustedNAR: res.data.netAnnualizedReturn.primaryAdjustedNAR,
            primaryUserAdjustedNAR:
              res.data.netAnnualizedReturn.primaryUserAdjustedNAR,
            tradedNAR: res.data.netAnnualizedReturn.tradedNAR,
            tradedAjustedNAR: res.data.netAnnualizedReturn.tradedAdjustedNAR,
            tradedUserAdjustedNAR:
              res.data.netAnnualizedReturn.tradedUserAdjustedNAR,
            combinedNAR: res.data.netAnnualizedReturn.combinedNAR,
            combinedAdjustedNAR:
              res.data.netAnnualizedReturn.combinedAdjustedNAR,
            combineduserAdjustedNAR:
              res.data.netAnnualizedReturn.combinedUserAdjustedNAR,
            adjustmentForPastDueNotes:
              res.data.adjustments.adjustmentForPastDueNotes
          }
        });
        console.log(this.state.lendingClubSummary);
        API.getLendingClubRecord()
          .then(res => {
            if (res.data.length > 0) {
              const lastRecordDate = res.data[0].date;
              const hoursSinceLastRecord = moment().diff(
                lastRecordDate,
                "hours"
              );
              console.log(hoursSinceLastRecord);
              if (hoursSinceLastRecord > 22) {
                API.saveLendingClubRecord(this.state.lendingClubSummary)
                  .then(res => console.log(res.data))
                  .catch(err => console.log(err));
              }
            } else {
              API.saveLendingClubRecord(this.state.lendingClubSummary)
                .then(res => console.log(res.data))
                .catch(err => console.log(err));
            }
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
  render() {
    return (
      <div className="m-5 px-3">
        <section className="row">
          <p>Text talking about lending club</p>
        </section>
      </div>
    );
  }
}

export default LendingClub;
