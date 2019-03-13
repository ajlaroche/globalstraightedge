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
      },
      plotReturnData: {}
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
        API.getLendingClubSummaryHistory()
          .then(res => {
            console.log(res.data);
            let categories = [];
            let returnValues = [];
            let projectedLoss = [];

            res.data.forEach(point => {
              categories.push(moment(point.date).format("DD-MMM-YY"));
              returnValues.push(
                parseFloat((point.combinedAdjustedNAR * 100).toFixed(2))
              );
              projectedLoss.push(
                parseFloat(
                  (
                    (point.adjustmentForPastDueNotes /
                      this.state.lendingClubSummary.outstandingPrincipal) *
                    100
                  ).toFixed(2)
                )
              );

              this.setState({
                plotReturnData: {
                  categories: categories,
                  values: returnValues,
                  projectedLoss: projectedLoss
                }
              });
              // console.log(this.state.plotReturnData);
            });
            Highcharts.chart("rateHistory", {
              legend: { enabled: false },
              title: { text: undefined },
              xAxis: {
                minPadding: 0.05,
                maxPadding: 0.05,
                categories: this.state.plotReturnData.categories.reverse()
              },
              yAxis: {
                title: { text: "Net Annualized Return" },
                labels: {
                  formatter: function() {
                    return Highcharts.numberFormat(this.value, 2) + "%";
                  }
                }
              },
              tooltip: {
                formatter: function() {
                  return "NAR: " + this.y + "%";
                }
              },
              plotOptions: {
                line: {
                  marker: {
                    enabled: false
                  }
                }
              },
              series: [
                {
                  data: this.state.plotReturnData.values.reverse()
                }
              ]
            });

            // Projected loss chart
            Highcharts.chart("projectedLoss", {
              legend: { enabled: false },
              title: { text: undefined },
              xAxis: {
                minPadding: 0.05,
                maxPadding: 0.05,
                categories: this.state.plotReturnData.categories
              },
              yAxis: {
                title: { text: undefined },
                labels: {
                  formatter: function() {
                    return Highcharts.numberFormat(this.value, 2) + "%";
                  }
                }
              },
              tooltip: {
                formatter: function() {
                  return "Projected Loss: " + this.y + "%";
                }
              },
              plotOptions: {
                line: {
                  marker: {
                    enabled: false
                  }
                }
              },
              series: [
                {
                  data: this.state.plotReturnData.projectedLoss.reverse()
                }
              ]
            });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));

    API.getLendingClubPortfolioMakeUp()
      .then(res => {
        console.log(res.data[0]);

        let donutSlices = [
          ["A", parseFloat(res.data[0].Avalue.toFixed(0))],
          ["B", parseFloat(res.data[0].Bvalue.toFixed(0))],
          ["C", parseFloat(res.data[0].Cvalue.toFixed(0))],
          ["D", parseFloat(res.data[0].Dvalue.toFixed(0))],
          ["E", parseFloat(res.data[0].Evalue.toFixed(0))],
          ["F", parseFloat(res.data[0].Fvalue.toFixed(0))],
          ["G", parseFloat(res.data[0].Gvalue.toFixed(0))]
        ];

        let durationSlices = [
          ["3yrs", parseFloat(res.data[0].shortLength.toFixed(0))],
          ["5yrs", parseFloat(res.data[0].longLength.toFixed(0))]
        ];

        let statusSlices = [
          ["Current", parseFloat(res.data[0].current.toFixed(0))],
          ["Grace Period", parseFloat(res.data[0].gracePeriod.toFixed(0))],
          ["Late 16-30 days", parseFloat(res.data[0].late16to30.toFixed(0))],
          ["Late 31-120 days", parseFloat(res.data[0].late31to120.toFixed(0))],
          ["Defaulted", parseFloat(res.data[0].defaulted.toFixed(0))],
          ["Issued", parseFloat(res.data[0].issued.toFixed(0))],
          ["In Funding", parseFloat(res.data[0].inFunding.toFixed(0))],
          ["In Review", parseFloat(res.data[0].inReview.toFixed(0))]
        ];

        let purposeSlices = [
          [
            "Debt Consolidation",
            parseFloat(res.data[0].debtConsolidation.toFixed(0))
          ],
          ["Credit Card", parseFloat(res.data[0].creditCard.toFixed(0))],
          ["Business", parseFloat(res.data[0].business.toFixed(0))],
          ["Medical", parseFloat(res.data[0].medical.toFixed(0))],
          ["Other", parseFloat(res.data[0].other.toFixed(0))],
          [
            "Home Improvement",
            parseFloat(res.data[0].homeImprovement.toFixed(0))
          ],
          ["Car Financing", parseFloat(res.data[0].carFinancing.toFixed(0))],
          ["Education", parseFloat(res.data[0].education.toFixed(0))],
          ["Major Purchase", parseFloat(res.data[0].majorPurchase.toFixed(0))],
          ["Green Loan", parseFloat(res.data[0].greenLoan.toFixed(0))],
          ["Home Buying", parseFloat(res.data[0].homeBuying.toFixed(0))],
          ["Moving", parseFloat(res.data[0].moving.toFixed(0))],
          ["Vacation", parseFloat(res.data[0].vacation.toFixed(0))]
        ];

        console.log(donutSlices);

        Highcharts.chart("historyComposition", {
          title: { text: undefined },
          chart: {
            type: "pie"
          },

          yAxis: {
            title: { text: "Grade Invested" }
          },
          plotOptions: {
            pie: {
              shadow: true
            }
          },
          tooltip: {
            formatter: function() {
              return "<b>" + this.percentage.toFixed(0) + "%" + "</b>";
            }
          },
          series: [
            {
              name: "Grade",
              data: donutSlices,
              size: "100%",
              innerSize: "50%",
              showInLegend: false,
              dataLabels: {
                enabled: true,
                distance: -30,
                style: { fontSize: "1rem" }
              }
            }
          ]
        });

        // Term doughnut chart
        Highcharts.chart("termLength", {
          title: { text: undefined },
          chart: {
            type: "pie"
          },

          yAxis: {
            title: { text: "Loan Term" }
          },
          plotOptions: {
            pie: {
              shadow: true
            }
          },
          tooltip: {
            formatter: function() {
              return "<b>" + this.percentage.toFixed(0) + "%" + "</b>";
            }
          },
          series: [
            {
              name: "Term",
              data: durationSlices,
              size: "75%",
              innerSize: "50%",
              showInLegend: false,
              dataLabels: {
                enabled: true,
                distance: -40,
                style: { fontSize: "1rem" }
              }
            }
          ]
        });

        // Status doughnut chart
        Highcharts.chart("loanStatus", {
          title: { text: undefined },
          chart: {
            type: "pie"
          },

          yAxis: {
            title: { text: "Loan Status" }
          },
          plotOptions: {
            pie: {
              shadow: true
            }
          },
          tooltip: {
            formatter: function() {
              return "<b>" + this.percentage.toFixed(0) + "%" + "</b>";
            }
          },
          series: [
            {
              name: "Status",
              data: statusSlices,
              size: "75%",
              innerSize: "50%",
              showInLegend: false,
              dataLabels: {
                enabled: true,
                // distance: -40,
                style: { fontSize: "0.9rem" }
              }
            }
          ]
        });

        // Purpose doughnut chart
        Highcharts.chart("loanPurpose", {
          title: { text: undefined },
          chart: {
            type: "pie"
          },

          yAxis: {
            title: { text: "Loan Purpose" }
          },
          plotOptions: {
            pie: {
              shadow: true
            }
          },
          tooltip: {
            formatter: function() {
              return "<b>" + this.percentage.toFixed(0) + "%" + "</b>";
            }
          },
          series: [
            {
              name: "Purpose",
              data: purposeSlices,
              size: "75%",
              innerSize: "50%",
              showInLegend: false,
              dataLabels: {
                enabled: true,
                // distance: -40,
                style: { fontSize: "0.9rem" }
              }
            }
          ]
        });
      })
      .catch(err => console.log(err));
  }
  render() {
    return (
      <div className="m-5 px-3">
        <section className="row">
          <article className="col-lg-3">
            <h2>Lending Club</h2>
            <p>
              Lending Club offers an alternative to bond ETFs where the investor
              has the opportunity to control the fixed income investment
              portfolio. It offers an alternative investment class that is
              uncorrelated to the stock market, but it largely affectd by the
              state of the US economy.
            </p>
            <br />
            <p>
              Lending Club is a peer-to-peer lending platform where investors
              can purchase fractions of newly issued unsecured loans at par
              value and collect the equivalent fraction of monthly payments. The
              investor is exposed to risk of default equivalent to consumer debt
              risks normally faced by credit card issuers. Much like every other
              investment, diversification within the asset class is critical to
              success. Investors should limit their risk by spreading their
              investment across a minimum of 200 loans.
            </p>
            <br />
            <p>
              Visit <a href="http://www.lendingclub.com">Lending Club</a> for
              additional information about the platform.
            </p>
          </article>
          <article className="col-lg-3">
            <h2>My Portfolio</h2>
            <p>
              I started investing in Lending Club in the early days of the
              platform, more than 10 years ago. Over the years, I have invested
              $33,697, have never withdrawn any funds, and have continuously
              reinvested interest payments. As a result, the portfolio that I
              have accumulated provides a window into the long term historical
              performance of this platform.
            </p>
            <br />
            <p>
              Throughout the period, my investment strategy has been moderately
              aggressive in the risk tolerance spectrum, slightly to the right
              of the average plateform note.
            </p>
          </article>
          <div className="col-lg-3">
            <h2 className="chartHeading">Performance</h2>
            <div id="rateHistory" style={{ height: "400px" }} />
          </div>
          <div className="col-lg-3">
            <h2 className="chartHeading">Composition</h2>
            <div id="historyComposition" style={{ height: "400px" }} />
          </div>
        </section>
        <h2>Lending Club Dashboard</h2>
        <section className="row">
          <div className="col-lg-3">
            <h2 className="chartHeading">Term</h2>
            <div id="termLength" style={{ height: "400px" }} />
          </div>
          <div className="col-lg-3">
            <h2 className="chartHeading">Status</h2>
            <div id="loanStatus" style={{ height: "400px" }} />
          </div>
          <div className="col-lg-3">
            <h2 className="chartHeading">Purpose</h2>
            <div id="loanPurpose" style={{ height: "400px" }} />
          </div>
          <div className="col-lg-3">
            <h2 className="chartHeading">Projected Losses</h2>
            <div id="projectedLoss" style={{ height: "400px" }} />
          </div>
        </section>
      </div>
    );
  }
}

export default LendingClub;
