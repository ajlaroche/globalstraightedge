import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import Highcharts from "highcharts";
import moment from "moment-timezone";

class LendingClub extends Component {
  constructor(props) {
    super(props);

    this.getSummary = this.getSummary.bind(this);
    this.noteSearch = this.noteSearch.bind(this);
    this.numberWithCommas = this.numberWithCommas.bind(this);

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
      plotReturnData: {},
      principalInvested: 0,
      gradeInvestedCapital: 0,
      gradePendingCapital: 0,
      gradeLostCapital: 0,
      gradeInterestEarned: 0,
      gradeNetIncome: 0,
      gradeCount: 0,
      gradeAvgROI: 0,
      gradeSelected: "A",
      gradeAge: 0
    };
  }

  componentDidMount() {
    this.getSummary();
    this.noteSearch(this.state.gradeSelected);
  }

  // Format numbers with commas
  numberWithCommas(x) {
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  // Function used to get loan stats by grade
  noteSearch(grade) {
    API.getLendingClubSearchNotes(grade)
      .then(res => {
        // console.log(res.data);
        let gradeCount = 0;
        let gradeInvested = 0;
        let gradePendingPrincipal = 0;
        let gradeChargedOffPrincipal = 0;
        let gradeInterestReceived = 0;
        let gradeNetEarnings = 0;
        let roiNumerator = 0;
        let roiDenominator = 0;
        let averageROI = 0;
        let sumGradeAge = 0;
        let avgGradeAge = 0;

        let gradePurpose = {
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

        let gradeTerms = { short: 0, long: 0 };

        let gradeStatus = {
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

        res.data.forEach(note => {
          gradeCount += 1;
          gradeInvested += note.noteAmount;
          gradeInterestReceived +=
            note.paymentsReceived - note.principalReceived;
          sumGradeAge += note.age;

          if (note.loanStatus !== "Charged Off") {
            gradePendingPrincipal += note.principalPending;
          } else {
            gradeChargedOffPrincipal += note.principalPending;
          }

          if (note.loanLength === 36) {
            gradeTerms.short += note.noteAmount;
          } else {
            gradeTerms.long += note.noteAmount;
          }

          gradePurpose[note.purpose] += note.noteAmount;
          gradeStatus[note.loanStatus] += note.noteAmount;

          let lostFactor = 0;

          // Estimate Projected Lost based on Lending Club estimated lost stats
          let status = note.loanStatus;

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

          // Calculate ROI using NSR's formula
          roiNumerator +=
            note.interestReceived +
            (note.paymentsReceived -
              note.interestReceived -
              note.principalReceived) -
            0.01 * note.paymentsReceived -
            lostFactor * note.principalPending;

          roiDenominator += note.interestReceived / (note.interestRate / 100);

          // console.log(status);
        });

        averageROI = roiNumerator / roiDenominator;
        gradeNetEarnings = gradeInterestReceived - gradeChargedOffPrincipal;
        avgGradeAge = sumGradeAge / gradeCount / 30;

        this.setState({
          gradeInvestedCapital: gradeInvested,
          gradePendingCapital: gradePendingPrincipal,
          gradeLostCapital: gradeChargedOffPrincipal,
          gradeInterestEarned: gradeInterestReceived,
          gradeNetIncome: gradeNetEarnings,
          gradeCount: gradeCount,
          gradeAvgROI: averageROI,
          gradeSelected: grade,
          gradeAge: avgGradeAge
        });

        let gradeStatusSlices = [
          ["Current", parseFloat(gradeStatus.Current.toFixed(0))],
          [
            "Grace Period",
            parseFloat(gradeStatus["In Grace Period"].toFixed(0))
          ],
          [
            "Late 16-30 days",
            parseFloat(gradeStatus["Late (16-30 days)"].toFixed(0))
          ],
          [
            "Late 31-120 days",
            parseFloat(gradeStatus["Late (31-120 days)"].toFixed(0))
          ],
          ["Defaulted", parseFloat(gradeStatus.Default.toFixed(0))],
          ["Issued", parseFloat(gradeStatus.Issued.toFixed(0))],
          ["In Funding", parseFloat(gradeStatus["In Funding"].toFixed(0))],
          ["In Review", parseFloat(gradeStatus["In Review"].toFixed(0))],
          {
            name: "Fully Paid",
            y: parseFloat(gradeStatus["Fully Paid"].toFixed(0)),
            color: "gray"
          },
          {
            name: "Charged Off",
            y: parseFloat(gradeStatus["Charged Off"].toFixed(0)),
            color: "red"
          }
        ];

        console.log(gradeStatusSlices);

        // Dynamic doughnut chart
        Highcharts.chart("gradeSpecific", {
          title: { text: undefined },
          chart: {
            type: "pie"
          },

          yAxis: {
            title: { text: "Loan Status" }
          },
          plotOptions: {
            pie: {
              shadow: true,
              center: ["40%", "40%"]
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
              data: gradeStatusSlices,
              size: "90%",
              innerSize: "50%",
              showInLegend: false,
              startAngle: 270,
              dataLabels: {
                enabled: true,
                distance: 5,
                crop: false,
                overflow: "allow",
                style: { fontSize: "0.7rem" },
                filter: {
                  property: "percentage",
                  operator: ">",
                  value: 1
                }
              }
            }
          ]
        });
      })
      .catch(err => console.log(err));
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
            // console.log(res.data);
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

        let chargeOffPurposeSlices = [
          [
            "Debt Consolidation",
            parseFloat(res.data[0].chargeOffDebtConsolidation.toFixed(0))
          ],
          [
            "Credit Card",
            parseFloat(res.data[0].chargeOffCreditCard.toFixed(0))
          ],
          ["Business", parseFloat(res.data[0].chargeOffBusiness.toFixed(0))],
          ["Medical", parseFloat(res.data[0].chargeOffMedical.toFixed(0))],
          ["Other", parseFloat(res.data[0].chargeOffOther.toFixed(0))],
          [
            "Home Improvement",
            parseFloat(res.data[0].chargeOffHomeImprovement.toFixed(0))
          ],
          [
            "Car Financing",
            parseFloat(res.data[0].chargeOffCarFinancing.toFixed(0))
          ],
          ["Education", parseFloat(res.data[0].chargeOffEducation.toFixed(0))],
          [
            "Major Purchase",
            parseFloat(res.data[0].chargeOffMajorPurchase.toFixed(0))
          ],
          ["Green Loan", parseFloat(res.data[0].chargeOffGreenLoan.toFixed(0))],
          [
            "Home Buying",
            parseFloat(res.data[0].chargeOffHomeBuying.toFixed(0))
          ],
          ["Moving", parseFloat(res.data[0].chargeOffMoving.toFixed(0))],
          ["Vacation", parseFloat(res.data[0].chargeOffVacation.toFixed(0))]
        ];

        let chargedOffSlices = [
          ["A", parseFloat(res.data[0].AchargedOff.toFixed(0))],
          ["B", parseFloat(res.data[0].BchargedOff.toFixed(0))],
          ["C", parseFloat(res.data[0].CchargedOff.toFixed(0))],
          ["D", parseFloat(res.data[0].DchargedOff.toFixed(0))],
          ["E", parseFloat(res.data[0].EchargedOff.toFixed(0))],
          ["F", parseFloat(res.data[0].FchargedOff.toFixed(0))],
          ["G", parseFloat(res.data[0].GchargedOff.toFixed(0))]
        ];

        let chargedOffDurationSlices = [
          ["3yrs", parseFloat(res.data[0].shortLengthChargedOff.toFixed(0))],
          ["5yrs", parseFloat(res.data[0].longLengthChargedOff.toFixed(0))]
        ];

        let chargedOffAgeBars = [
          parseFloat(res.data[0].chargedOff_0to6.toFixed(0)),
          parseFloat(res.data[0].chargedOff_6to12.toFixed(0)),
          parseFloat(res.data[0].chargedOff_12to18.toFixed(0)),
          parseFloat(res.data[0].chargedOff_18to24.toFixed(0)),
          parseFloat(res.data[0].chargedOff_24to30.toFixed(0)),
          parseFloat(res.data[0].chargedOff_30to36.toFixed(0)),
          parseFloat(res.data[0].chargedOff_36Plus.toFixed(0))
        ];

        let activeAgeBars = [
          parseFloat(res.data[0].activeAge_0to6.toFixed(0)),
          parseFloat(res.data[0].activeAge_6to12.toFixed(0)),
          parseFloat(res.data[0].activeAge_12to18.toFixed(0)),
          parseFloat(res.data[0].activeAge_18to24.toFixed(0)),
          parseFloat(res.data[0].activeAge_24to30.toFixed(0)),
          parseFloat(res.data[0].activeAge_30to36.toFixed(0)),
          parseFloat(res.data[0].activeAge_36Plus.toFixed(0))
        ];

        let roiDistributionBar = [
          res.data[0].roi_10minus,
          res.data[0].roi_minus10to5,
          res.data[0].roi_minus5to0,
          res.data[0].roi_0to5,
          res.data[0].roi_5to10,
          res.data[0].roi_10to15,
          res.data[0].roi_15plus
        ];

        let roiByGrade = [
          res.data[0].roi_AsumProduct / res.data[0].Avalue,
          res.data[0].roi_BsumProduct / res.data[0].Bvalue,
          res.data[0].roi_CsumProduct / res.data[0].Cvalue,
          res.data[0].roi_DsumProduct / res.data[0].Dvalue,
          res.data[0].roi_EsumProduct / res.data[0].Evalue,
          res.data[0].roi_FsumProduct / res.data[0].Fvalue,
          res.data[0].roi_GsumProduct / res.data[0].Gvalue
        ];

        console.log(roiByGrade);

        this.setState({
          principalInvested: res.data[0].principalInvested
        });

        console.log(donutSlices);

        Highcharts.setOptions({
          lang: {
            decimalPoint: ".",
            thousandsSep: ","
          }
        });

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

        // Charged Off Composition doughnut chart
        Highcharts.chart("chargedOffComposition", {
          title: { text: undefined },
          chart: {
            type: "pie"
          },

          yAxis: {
            title: { text: "Composition" }
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
              name: "Composition",
              data: chargedOffSlices,
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

        // Charged Off Term doughnut chart
        Highcharts.chart("chargedOffTerm", {
          title: { text: undefined },
          chart: {
            type: "pie"
          },

          yAxis: {
            title: { text: "Charged Off Loan Term" }
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
              data: chargedOffDurationSlices,
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

        // Charged Off Purpose doughnut chart
        Highcharts.chart("chargedOffPurpose", {
          title: { text: undefined },
          chart: {
            type: "pie"
          },

          yAxis: {
            title: { text: "Charged Off Loan Purpose" }
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
              data: chargeOffPurposeSlices,
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

        // Charged Off age chart
        Highcharts.chart("chargedOffAge", {
          title: { text: undefined },
          chart: {
            type: "column"
          },

          xAxis: {
            categories: [
              "< 6 Mos",
              "6-12 Mos",
              "12-18 Mos",
              "18-24 Mos",
              "24-30 Mos",
              "30-36 Mos",
              "> 36 Mos"
            ]
          },

          yAxis: {
            title: { text: "Number of Notes" }
          },
          plotOptions: {
            column: {
              shadow: true,
              pointPadding: 0.2,
              borderWidth: 0
            }
          },
          // tooltip: {
          //   valueDecimals: 0,
          //   valuePrefix: "$"
          //   // valueSuffix: ' USD'
          // },
          series: [
            {
              name: "Number of Notes",
              data: chargedOffAgeBars,
              showInLegend: false,
              dataLabels: {
                enabled: false,
                // distance: -40,
                style: { fontSize: "0.9rem" }
              }
            }
          ]
        });

        // Active Notes age chart
        Highcharts.chart("activeAge", {
          title: { text: undefined },
          chart: {
            type: "column"
          },

          xAxis: {
            categories: [
              "< 6 Mos",
              "6-12 Mos",
              "12-18 Mos",
              "18-24 Mos",
              "24-30 Mos",
              "30-36 Mos",
              "> 36 Mos"
            ]
          },

          yAxis: {
            title: { text: "Number of Notes" }
          },
          plotOptions: {
            column: {
              shadow: true,
              pointPadding: 0.2,
              borderWidth: 0
            }
          },
          // tooltip: {
          //   valueDecimals: 0,
          //   valuePrefix: "$"
          //   // valueSuffix: ' USD'
          // },
          series: [
            {
              name: "Number of Notes",
              data: activeAgeBars,
              showInLegend: false,
              dataLabels: {
                enabled: false,
                // distance: -40,
                style: { fontSize: "0.9rem" }
              }
            }
          ]
        });

        // ROI Distribution chart
        Highcharts.chart("roiDistribution", {
          title: { text: undefined },
          chart: {
            type: "column"
          },

          xAxis: {
            categories: [
              "< -10%",
              "-10% to -5%",
              "-5% to 0%",
              "0% to 5%",
              "5% to 10%",
              "10% to 15%",
              "> 15%"
            ]
          },

          yAxis: {
            title: { text: "Number of Notes" }
          },
          plotOptions: {
            column: {
              shadow: true,
              pointPadding: 0.2,
              borderWidth: 0
            }
          },
          // tooltip: {
          //   valueDecimals: 0,
          //   valuePrefix: "$"
          // },
          series: [
            {
              name: "Number of Notes",
              data: roiDistributionBar,
              showInLegend: false,
              dataLabels: {
                enabled: false,
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
            <br />

            {/* Table with portfolio summary data */}
            <div className="row">
              <div className="col-lg-6 accountTableHeading">
                <h5>Current Acctount Value:</h5>
              </div>
              <div className="col-lg-6 accountTableValue">
                <h5>
                  $
                  {this.numberWithCommas(
                    this.state.lendingClubSummary.accountTotal.toFixed(0)
                  )}
                </h5>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 accountTableHeading">
                <h5>Projected Losses:</h5>
              </div>
              <div className="col-lg-6 accountTableValue">
                <h5>
                  $
                  {this.numberWithCommas(
                    this.state.lendingClubSummary.adjustmentForPastDueNotes.toFixed(
                      0
                    )
                  )}
                </h5>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 accountTableHeading">
                <h5>Return on Investment:</h5>
              </div>
              <div className="col-lg-6 accountTableValue">
                <h5>
                  {(
                    this.state.lendingClubSummary.combinedAdjustedNAR * 100
                  ).toFixed(2)}
                  %
                </h5>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 accountTableHeading">
                <h5>Total Number of Notes:</h5>
              </div>
              <div className="col-lg-6 accountTableValue">
                <h5>
                  {this.numberWithCommas(
                    this.state.lendingClubSummary.totalNotes.toFixed(0)
                  )}
                </h5>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 accountTableHeading">
                <h5>Average Note Size:</h5>
              </div>
              <div className="col-lg-6 accountTableValue">
                <h5>
                  $
                  {(
                    this.state.principalInvested /
                    this.state.lendingClubSummary.totalNotes
                  ).toFixed(0)}
                </h5>
              </div>
            </div>
            {/* End of Table */}
          </article>
          <div className="col-lg-3">
            <h2 className="chartHeading">Historical Performance</h2>
            <div id="rateHistory" style={{ height: "400px" }} />
          </div>
          <div className="col-lg-3">
            <h2 className="chartHeading">Composition</h2>
            <div id="historyComposition" style={{ height: "400px" }} />
          </div>
        </section>
        <h2>Lending Club Active Notes Dashboard</h2>
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
          <div className="col-lg-3">
            <h2 className="chartHeading">Annualized ROI</h2>
            <div id="roiDistribution" style={{ height: "400px" }} />
          </div>
          <div className="col-lg-3">
            <h2 className="chartHeading">Age of Active Notes</h2>
            <div id="activeAge" style={{ height: "400px" }} />
          </div>
          <div className="col-lg-6">
            <h2 className="chartHeading">Grade Profile</h2>
            <div className="row justify-content-center">
              <h4>
                <button
                  type="button"
                  className="btn btn-link gradeSelect"
                  onClick={() => this.noteSearch("A")}
                >
                  A
                </button>{" "}
                <button
                  type="button"
                  className="btn btn-link gradeSelect"
                  onClick={() => this.noteSearch("B")}
                >
                  B
                </button>{" "}
                <button
                  type="button"
                  className="btn btn-link gradeSelect"
                  onClick={() => this.noteSearch("C")}
                >
                  C
                </button>{" "}
                <button
                  type="button"
                  className="btn btn-link gradeSelect"
                  onClick={() => this.noteSearch("D")}
                >
                  D
                </button>{" "}
                <button
                  type="button"
                  className="btn btn-link gradeSelect"
                  onClick={() => this.noteSearch("E")}
                >
                  E
                </button>{" "}
                <button
                  type="button"
                  className="btn btn-link gradeSelect"
                  onClick={() => this.noteSearch("F")}
                >
                  F
                </button>{" "}
                <button
                  type="button"
                  className="btn btn-link gradeSelect"
                  onClick={() => this.noteSearch("G")}
                >
                  G
                </button>
              </h4>
            </div>
            {/* Table with grade specific summary data */}
            <div className="row">
              <div className="col-lg-5">
                <div className="row">
                  <div className="col-lg-8 accountTableHeading">
                    <h5 style={{ fontWeight: "bold" }}>Selected Grade:</h5>
                  </div>
                  <div className="col-lg-4 accountTableValue">
                    <h5 style={{ fontWeight: "bold" }}>
                      {this.state.gradeSelected}
                    </h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8 accountTableHeading">
                    <h5>Number of Notes:</h5>
                  </div>
                  <div className="col-lg-4 accountTableValue">
                    <h5>
                      {this.numberWithCommas(this.state.gradeCount.toFixed(0))}
                    </h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8 accountTableHeading">
                    <h5>Average Age (months):</h5>
                  </div>
                  <div className="col-lg-4 accountTableValue">
                    <h5>{this.state.gradeAge.toFixed(0)}</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8 accountTableHeading">
                    <h5>Capital Invested:</h5>
                  </div>
                  <div className="col-lg-4 accountTableValue">
                    <h5>
                      $
                      {this.numberWithCommas(
                        this.state.gradeInvestedCapital.toFixed(0)
                      )}
                    </h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8 accountTableHeading">
                    <h5>Capital Oustanding:</h5>
                  </div>
                  <div className="col-lg-4 accountTableValue">
                    <h5>
                      $
                      {this.numberWithCommas(
                        this.state.gradePendingCapital.toFixed(0)
                      )}
                    </h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8 accountTableHeading">
                    <h5>Interest Earned:</h5>
                  </div>
                  <div className="col-lg-4 accountTableValue">
                    <h5 style={{ color: "green" }}>
                      $
                      {this.numberWithCommas(
                        this.state.gradeInterestEarned.toFixed(0)
                      )}
                    </h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8 accountTableHeading">
                    <h5>Capital Charged Off:</h5>
                  </div>
                  <div className="col-lg-4 accountTableValue">
                    <h5 style={{ color: "red" }}>
                      ($
                      {this.numberWithCommas(
                        this.state.gradeLostCapital.toFixed(0)
                      )}
                      )
                    </h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8 accountTableHeading">
                    <h5 style={{ fontWeight: "bold" }}>Net Earnings:</h5>
                  </div>
                  <div className="col-lg-4 accountTableValue">
                    <h5 style={{ fontWeight: "bold" }}>
                      $
                      {this.numberWithCommas(
                        this.state.gradeNetIncome.toFixed(0)
                      )}
                    </h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8 accountTableHeading">
                    <h5 style={{ fontWeight: "bold" }}>Annualized ROI:</h5>
                  </div>
                  <div className="col-lg-4 accountTableValue">
                    <h5 style={{ fontWeight: "bold" }}>
                      {this.numberWithCommas(
                        (this.state.gradeAvgROI * 100).toFixed(2)
                      )}
                      %
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                {/* <h2 className="chartHeading">Age at Default</h2> */}
                <div id="gradeSpecific" style={{ height: "350px" }} />
              </div>
            </div>
          </div>
        </section>
        <h2>Charged Off Loans</h2>
        <section className="row">
          <div className="col-lg-3">
            <h2 className="chartHeading">Composition</h2>
            <div id="chargedOffComposition" style={{ height: "400px" }} />
          </div>
          <div className="col-lg-3">
            <h2 className="chartHeading">Term</h2>
            <div id="chargedOffTerm" style={{ height: "400px" }} />
          </div>
          <div className="col-lg-3">
            <h2 className="chartHeading">Purpose</h2>
            <div id="chargedOffPurpose" style={{ height: "400px" }} />
          </div>
          <div className="col-lg-3">
            <h2 className="chartHeading">Age at Default</h2>
            <div id="chargedOffAge" style={{ height: "400px" }} />
          </div>
        </section>
      </div>
    );
  }
}

export default LendingClub;
