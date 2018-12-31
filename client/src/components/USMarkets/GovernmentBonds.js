import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import Highcharts from "highcharts";
import moment from "moment-timezone";

class GovernmentBonds extends Component {
  constructor(props) {
    super(props);

    this.updateQuotes = this.updateQuotes.bind(this);
    this.getGlobalQuotes = this.getGlobalQuotes.bind(this);
    this.plotBenchmark = this.plotBenchmark.bind(this);

    this.state = {
      tickers: [
        { ticker: "SPY", name: "SPDR S&P 500 ETF Trust" },
        { ticker: "AGG", name: "iShares Core Total US Bond Market ETF" },
        {
          ticker: "VTIP",
          name: "Vanguard Short-Term Inflation-Protected Securities"
        },
        { ticker: "SHV", name: "iShares Short-Term Treasury Bond ETF" },
        { ticker: "MUB", name: "iShares National AMT-Free Muni Bond ETF" }
      ],
      interval: "1m",
      priceView: "change",
      axisTitle: "relative change",
      axisUnits: "%",
      returnedData: [],
      legendShow: true,
      addBenchmark: false,
      benchmarkTicker: "SPY",
      benchmarkIndex: 0,
      primaryStock: {},
      secondaryStock: {},
      tertiaryStock: {},
      benchmarkData: {},
      plotSeries: [],
      dayOfWeek: 0
    };
  }

  componentDidMount() {
    this.getGlobalQuotes(this.state.interval, this.state.priceView);
  }

  updateQuotes(userInterval, dataType) {
    console.log(userInterval);
    const today = new Date();
    const marketOpen = moment("09:00:00", "HH:mm:ss");
    const marketClose = moment("16:30:00", "HH:mm:ss");
    const marketTime = moment()
      .tz("America/New_York")
      .isBetween(marketOpen, marketClose);
    console.log(marketTime);

    // Need to correct if falls on weekend or outside market hours
    if (
      userInterval === "1d" &&
      (today.getDay() === 0 || today.getDay() === 6)
    ) {
      userInterval = "1m";
      this.setState({
        interval: userInterval
      });
      this.getGlobalQuotes(userInterval, dataType);
    } else {
      this.setState({
        interval: userInterval
      });
      this.getGlobalQuotes(userInterval, dataType);
    }
  }

  plotBenchmark(ticker) {
    this.setState({
      addBenchmark:
        this.state.addBenchmark && this.state.benchmarkTicker !== ticker // First check if there was already a benchmark showing
          ? this.state.addBenchmark
          : !this.state.addBenchmark,
      benchmarkTicker: ticker,
      benchmarkData: {
        name: this.state.returnedData[this.state.benchmarkIndex].ticker,
        data: this.state.returnedData[this.state.benchmarkIndex].yAxis
      },
      axisTitle: "relative change",
      axisUnits: "%"
    });
    this.updateQuotes(this.state.interval, "change");
  }

  getGlobalQuotes(userInterval, dataType) {
    this.setState({
      returnedData: [],
      interval: userInterval,
      priceView: dataType
    });

    // Adjust x axis depending on user selected time interval
    let changeAxis = 1;
    let numberDays = 30;

    switch (userInterval) {
      case "1d":
        changeAxis = 10;
        numberDays = 1;
        break;
      case "1m":
        changeAxis = 1;
        numberDays = 30;
        break;
      case "1y":
        changeAxis = 10;
        numberDays = 365;
        break;
      case "5y":
        changeAxis = 60;
        numberDays = 1825;
        break;
      default:
        changeAxis = 1;
        numberDays = 30;
    }

    let tempValues = [];

    this.state.tickers.forEach(element => {
      API.getGlobalIndex({ ticker: element.ticker, interval: userInterval })
        .then(res => {
          let categories = [];
          let values = [];
          let indexData = {};
          let timeScale = "";
          let dataPoint = 0;
          let lastPrice = res.data[res.data.length - 1].close;
          let returntoDate = 0;

          // Adjust return to date key if user selects 1 day interval since API object is different for minute data
          if (userInterval === "1d") {
            for (let i = 1; i < res.data.length; i++) {
              returntoDate =
                res.data[res.data.length - i].marketChangeOverTime * 100;
              lastPrice = res.data[res.data.length - i].marketClose;

              if (lastPrice) break;
            }
          } else {
            returntoDate = res.data[res.data.length - 1].changeOverTime * 100;
            lastPrice = res.data[res.data.length - 1].close;
          }

          // console.log(res.data);
          res.data.forEach(point => {
            if (userInterval === "1d") {
              timeScale = point.minute;
              if (dataType === "price") {
                dataPoint = point.marketClose;
              } else {
                dataPoint = point.marketChangeOverTime * 100;
              }
            } else {
              timeScale = point.date;
              if (dataType === "price") {
                dataPoint = point.close;
              } else {
                dataPoint = point.changeOverTime * 100;
              }
            }

            // Check if datapoint is valid before pushing to prevent graph scaling issues.
            // This mostly affects the daily graph option
            if (
              dataPoint &&
              !(
                userInterval === "1d" &&
                dataType === "change" &&
                dataPoint < -99
              ) &&
              !(
                userInterval === "1d" &&
                dataType === "change" &&
                dataPoint > 99
              ) &&
              !(
                userInterval === "1d" &&
                dataType === "price" &&
                dataPoint === 0
              )
            ) {
              categories.push(timeScale);
              values.push(dataPoint);
            }
          });

          indexData = {
            ticker: element.ticker,
            name: element.name,
            currentPrice: lastPrice,
            returnPercent: returntoDate.toFixed(2),
            annualizedReturn:
              (Math.pow(1 + returntoDate / 100, 365 / numberDays) - 1) * 100,
            xAxis: categories,
            yAxis: values,
            xLastPoint: categories.length - 1, // Use to place annotation
            yLastPoint: values[values.length - 1] // Use to place annotation
          };
          // console.log(indexData);
          tempValues.push(indexData);

          this.setState({
            returnedData: tempValues
          });

          let firstTargetStockIndex = tempValues.findIndex(element => {
            return element.ticker === "VTIP";
          });

          let secondTargetStockIndex = tempValues.findIndex(element => {
            return element.ticker === "SHV";
          });

          let thirdTargetStockIndex = tempValues.findIndex(element => {
            return element.ticker === "MUB";
          });

          this.setState({
            benchmarkIndex: tempValues.findIndex(element => {
              return element.ticker === this.state.benchmarkTicker;
            })
          });

          this.setState({
            primaryStock: {
              name: `${this.state.returnedData[firstTargetStockIndex].name}(${
                this.state.returnedData[firstTargetStockIndex].ticker
              })`,
              data: this.state.returnedData[firstTargetStockIndex].yAxis
              //   color:
              //     this.state.returnedData[firstTargetStockIndex].returnPercent >=
              //     0
              //       ? "green"
              //       : "red"
            },
            secondaryStock: {
              name: `${this.state.returnedData[secondTargetStockIndex].name}(${
                this.state.returnedData[secondTargetStockIndex].ticker
              })`,
              data: this.state.returnedData[secondTargetStockIndex].yAxis
              // color:
              //   this.state.returnedData[secondTargetStockIndex].returnPercent >=
              //   0
              //     ? "green"
              //     : "red"
            },
            tertiaryStock: {
              name: `${this.state.returnedData[thirdTargetStockIndex].name}(${
                this.state.returnedData[thirdTargetStockIndex].ticker
              })`,
              data: this.state.returnedData[thirdTargetStockIndex].yAxis
              // color:
              //   this.state.returnedData[thirdTargetStockIndex].returnPercent >=
              //   0
              //     ? "green"
              //     : "red"
            }
          });

          this.setState({
            benchmarkData: {
              name: this.state.returnedData[this.state.benchmarkIndex].ticker,
              data: this.state.returnedData[this.state.benchmarkIndex].yAxis
            }
          });

          if (this.state.addBenchmark) {
            this.setState({
              plotSeries: [
                this.state.primaryStock,
                this.state.secondaryStock,
                this.state.tertiaryStock,
                this.state.benchmarkData
              ]
            });
          } else {
            this.setState({
              plotSeries: [
                this.state.primaryStock,
                this.state.secondaryStock,
                this.state.tertiaryStock
              ]
            });
          }

          // Start building chart here

          // Build annotation text depending on whether annualized or not
          let labelFirstLine, labelSecondLine, labelThirdLine;

          if (userInterval === "5y") {
            labelFirstLine = `U.S. TIPS Annualized: ${this.state.returnedData[
              firstTargetStockIndex
            ].annualizedReturn.toFixed(2)}%`;
          } else {
            labelFirstLine = `U.S. TIPS: ${
              this.state.returnedData[firstTargetStockIndex].returnPercent
            }%`;
          }

          if (userInterval === "5y") {
            labelSecondLine = `ST Treasuries Annualized: ${this.state.returnedData[
              secondTargetStockIndex
            ].annualizedReturn.toFixed(2)}%`;
          } else {
            labelSecondLine = `ST Treasuries: ${
              this.state.returnedData[secondTargetStockIndex].returnPercent
            }%`;
          }

          if (userInterval === "5y") {
            labelThirdLine = `Muni Bonds Annualized: ${this.state.returnedData[
              thirdTargetStockIndex
            ].annualizedReturn.toFixed(2)}%`;
          } else {
            labelThirdLine = `Muni Bonds: ${
              this.state.returnedData[thirdTargetStockIndex].returnPercent
            }%`;
          }

          // End build annotion box

          if (
            firstTargetStockIndex !== -1 &&
            secondTargetStockIndex !== -1 &&
            thirdTargetStockIndex !== -1
          ) {
            const units = this.state.axisUnits;

            Highcharts.chart("governmentBonds", {
              legend: { enabled: this.state.legendShow },
              title: {
                text: `Government Bonds`
              },
              xAxis: [
                {
                  minPadding: 0.05,
                  maxPadding: 0.05,
                  tickInterval: changeAxis,
                  categories: this.state.returnedData[firstTargetStockIndex]
                    .xAxis
                }
              ],
              yAxis: [
                {
                  title: { text: this.state.axisTitle },
                  labels: {
                    formatter: function() {
                      return this.value + units;
                    }
                  }
                  // tickInterval: 1
                }
              ],

              tooltip: {
                valueDecimals: 2,
                valuePrefix: this.state.priceView === "price" ? "$" : "",
                valueSuffix: this.state.priceView === "price" ? "" : "%"
              },

              plotOptions: {
                line: {
                  marker: {
                    enabled: false
                  }
                }
              },
              series: this.state.plotSeries,
              annotations: [
                {
                  labels: [
                    {
                      point: {
                        x: this.state.returnedData[firstTargetStockIndex]
                          .xLastPoint,
                        y: 0,
                        xAxis: 0
                        // yAxis: 0
                      },

                      // LOGIC: if user interval selected is 5y, then show annualized roi, otherwise, just show ROI.
                      // If a benchmark is selected also show annualized ROI or just ROI depending on user inderval.
                      text: `${labelFirstLine}
                      <br>${labelSecondLine}
                      <br>${labelThirdLine}
                      
                       ${
                         this.state.addBenchmark && userInterval === "5y"
                           ? `<br>${
                               this.state.benchmarkTicker
                             } Annualized ROI: ${this.state.returnedData[
                               this.state.benchmarkIndex
                             ].annualizedReturn.toFixed(2)}%`
                           : ""
                       } 
                       ${
                         this.state.addBenchmark && userInterval !== "5y"
                           ? `<br>${this.state.benchmarkTicker} ROI: ${
                               this.state.returnedData[
                                 this.state.benchmarkIndex
                               ].returnPercent
                             }%`
                           : ""
                       }`,

                      // crop: true,
                      overflow: "justify",
                      align: "center",
                      style: {
                        fontSize: "0.8rem",
                        textAlign: "right"
                      },
                      useHTML: true
                    }
                  ]
                }
              ],
              labelOptions: {
                shape: "rect",
                align: "center",

                x: 0,
                y: -40
              }
            });
          }
        })
        .catch(err => console.log(err));

      // console.log(this.state.returnedData);
    });
  }

  render() {
    return (
      <div className="m-5 px-3">
        <section className="row">
          <article className="col-md-6 my-auto">
            <h2>Government Bonds</h2>
            <p>
              Inflation protected bonds serve to insulate a part of the
              portfolio from the depreciating effects of inflation, while also
              offering historically low correlation with other types of bonds,
              helping to achieve greater diversification. Additional
              diversification in a bond portfolio adds a layer of protection
              during market downturns.{" "}
            </p>
            <br />
            <p>
              U.S. Short-Term Treasury Bonds are issued by the U.S. Treasury
              with short maturity terms between one month and one year, offering
              extremely low risk exposure. Generally, U.S. Short-Term Treasury
              Bonds are considered a cash alternative, generating nominal
              benefit through interest payments. At lower stock allocations,
              these bonds help to decrease the risk of an overall portfolio.U.S.{" "}
            </p>
            <br />
            <p>
              Municipal Bonds are only included in taxable portfolios, since the
              interest from them is generally federally tax-exempt. The
              underlying bonds are issued by state and regional governments to
              finance capital expenditures, such as infrastructure spending.
              While municipal bond credit risk is slightly higher than risk-free
              U.S. Treasuries, it still remains very low, which is attractive
              for risk-averse investors. This characteristic, coupled with
              favorable federal tax treatment, makes municipal bonds an
              excellent addition to taxable portfolios.
            </p>
            <br />
            <p>
              Including bonds governemnt bonds on a portfolio provides some
              stability during times of high volatility as well as some downside
              proctection. Their often counter cyclical profile relative to
              stocks, low volatility, and income stream mitigate short term
              market risk as well inflation protection relative to cash.
            </p>
          </article>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-5">
                <h6>
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() =>
                      this.updateQuotes("1d", this.state.priceView)
                    }
                  >
                    1 Day
                  </button>
                  |{" "}
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() =>
                      this.updateQuotes("1m", this.state.priceView)
                    }
                  >
                    1 Month
                  </button>{" "}
                  |{" "}
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() =>
                      this.updateQuotes("1y", this.state.priceView)
                    }
                  >
                    1 Year
                  </button>{" "}
                  |{" "}
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() =>
                      this.updateQuotes("5y", this.state.priceView)
                    }
                  >
                    5 Year
                  </button>
                </h6>
              </div>
              <div className="col-md-5">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => {
                    this.updateQuotes(this.state.interval, "price");
                    this.setState({
                      axisTitle: "$ per Share",
                      axisUnits: "",
                      addBenchmark: false
                      //   legendShow: false
                    });
                  }}
                >
                  Price
                </button>
                |
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => {
                    this.updateQuotes(this.state.interval, "change");
                    this.setState({
                      axisTitle: "relative change",
                      axisUnits: "%"
                    });
                  }}
                >
                  %Change
                </button>
              </div>
              <div className="col-md-2">
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="benchmarkMenu"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Add a Benchmark
                  </button>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="benchmarkMenu"
                  >
                    <button
                      className={`dropdown-item ${
                        this.state.benchmarkTicker === "SPY" &&
                        this.state.addBenchmark
                          ? "active"
                          : ""
                      }`}
                      type="button"
                      onClick={() => {
                        this.plotBenchmark("SPY");
                      }}
                    >
                      US Equities
                    </button>

                    <button
                      className={`dropdown-item ${
                        this.state.benchmarkTicker === "AGG" &&
                        this.state.addBenchmark
                          ? "active"
                          : ""
                      }`}
                      type="button"
                      onClick={() => {
                        this.plotBenchmark("AGG");
                      }}
                    >
                      US Bonds
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="row"
              id="governmentBonds"
              style={{ height: "400px" }}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default GovernmentBonds;
