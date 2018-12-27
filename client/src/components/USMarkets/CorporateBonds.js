import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import Highcharts from "highcharts";
import moment from "moment-timezone";

class CorporateBonds extends Component {
  constructor(props) {
    super(props);

    this.updateQuotes = this.updateQuotes.bind(this);
    this.getGlobalQuotes = this.getGlobalQuotes.bind(this);
    this.plotBenchmark = this.plotBenchmark.bind(this);

    this.state = {
      tickers: [
        { ticker: "SPY", name: "SPDR S&P 500 ETF Trust" },
        { ticker: "SHV", name: "iShares Short-Term Treasury Bond ETF" },
        { ticker: "AGG", name: "iShares Core Total US Bond Market ETF" },
        {
          ticker: "NEAR",
          name: "iShares Short Maturity Bond ETF"
        },
        { ticker: "HYG", name: "iShares USD High Yield Corporate Bond ETF" }
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
            return element.ticker === "AGG";
          });

          let secondTargetStockIndex = tempValues.findIndex(element => {
            return element.ticker === "NEAR";
          });

          let thirdTargetStockIndex = tempValues.findIndex(element => {
            return element.ticker === "HYG";
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
            labelFirstLine = `Investment Grade Annualized: ${this.state.returnedData[
              firstTargetStockIndex
            ].annualizedReturn.toFixed(2)}%`;
          } else {
            labelFirstLine = `Investment Grade: ${
              this.state.returnedData[firstTargetStockIndex].returnPercent
            }%`;
          }

          if (userInterval === "5y") {
            labelSecondLine = `ST Investment Grade Annualized: ${this.state.returnedData[
              secondTargetStockIndex
            ].annualizedReturn.toFixed(2)}%`;
          } else {
            labelSecondLine = `ST Investment Grade: ${
              this.state.returnedData[secondTargetStockIndex].returnPercent
            }%`;
          }

          if (userInterval === "5y") {
            labelThirdLine = `High Yield Annualized: ${this.state.returnedData[
              thirdTargetStockIndex
            ].annualizedReturn.toFixed(2)}%`;
          } else {
            labelThirdLine = `High Yield: ${
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

            Highcharts.chart("corporateBonds", {
              legend: { enabled: this.state.legendShow },
              title: {
                text: `Corporate Bonds`
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
            <h2>Corporate Bonds</h2>
            <p>
              U.S. High Quality Bonds provide exposure to the U.S.
              investment-grade bond market, bringing stability to portfolios,
              while offering higher cash income than U.S. Treasury bonds alone.
              The underlying bonds in this set of holdings have been rated no
              lower than BBB- by Standard and Poor’s, or Baa3 by Moody’s,
              minimizing credit risk. U.S. High Quality Bonds are still subject
              to interest rate risk. These bonds are offered by the U.S.
              government and high-quality U.S. corporations, and also could be
              comprised of mortgage-backed securities. The average bond maturity
              of the underlying bonds in this individual asset class is 8 years.
            </p>
            <br />
            <p>
              U.S. Short-Term Investment-Grade Bonds are U.S.
              dollar-denominated, high credit quality bonds and other debt
              instruments issued by corporations and governments. These
              securities have maturities of less than three years. Generally,
              U.S. Short-Term Investment-Grade Bonds are low-risk investments
              with slightly higher yields than US Treasury bills.
            </p>
            <br />
            <p>
              The high yield bond ETF replicates much of the overall junk bond
              market, but often with shorter maturity, less interest-rate
              sensitivity, and also less yield.
            </p>
            <br />
            <p>
              Corporate bonds can increase yields of Bond portion of the
              portfolio with some incremental risk. Although the risk is higher
              than US government bonds, it still some protection to the stock
              market's short volatility exposure.
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
                        this.state.benchmarkTicker === "SHV" &&
                        this.state.addBenchmark
                          ? "active"
                          : ""
                      }`}
                      type="button"
                      onClick={() => {
                        this.plotBenchmark("SHV");
                      }}
                    >
                      US Short Term Treasuries
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="row"
              id="corporateBonds"
              style={{ height: "400px" }}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default CorporateBonds;
