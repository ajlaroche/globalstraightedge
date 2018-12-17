import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import Highcharts from "highcharts";
import Annotations from "highcharts/modules/annotations";
import ReactHighcharts from "react-highcharts";
import moment from "moment-timezone";

Annotations(ReactHighcharts.Highcharts);

class DevelopedStock extends Component {
  constructor(props) {
    super(props);

    this.updateQuotes = this.updateQuotes.bind(this);
    this.getGlobalQuotes = this.getGlobalQuotes.bind(this);
    this.plotBenchmark = this.plotBenchmark.bind(this);

    this.state = {
      tickers: [
        { ticker: "VEA", name: "Vanguard FTSE Developed Markets" },
        { ticker: "SPY", name: "SPDR S&P 500 ETF Trust" },
        { ticker: "UUP", name: "Invesco DB U.S. Dollar Index Bullish Fund" }
        // { ticker: "BNDX", name: "Vanguard Total International Bond" },
        // { ticker: "EMB", name: "iShares Emerging Markets USD Bond" }
      ],
      interval: "1m",
      priceView: "price",
      axisTitle: "$ per Share",
      axisUnits: "",
      returnedData: [],
      legendShow: false,
      addBenchmark: false,
      benchmarkTicker: "SPY",
      benchmarkIndex: 0,
      primaryStock: {},
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
      (today.getDay() === 0 || today.getDay() === 6 || !marketTime)
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
      legendShow:
        this.state.legendShow && this.state.benchmarkTicker !== ticker
          ? this.state.legendShow
          : !this.state.legendShow,
      benchmarkTicker: ticker,
      benchmarkData: {
        name: this.state.returnedData[this.state.benchmarkIndex].ticker,
        data: this.state.returnedData[this.state.benchmarkIndex].yAxis
      },
      plotSeries: [this.state.primaryStock, this.state.benchmarkData],
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
          let returntoDate = res.data[res.data.length - 1].changeOverTime * 100;

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
            categories.push(timeScale);
            values.push(dataPoint);
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

          tempValues.push(indexData);

          this.setState({
            returnedData: tempValues
          });

          let developedStockIndex = tempValues.findIndex(element => {
            return element.ticker === "VEA";
          });

          this.setState({
            benchmarkIndex: tempValues.findIndex(element => {
              return element.ticker === this.state.benchmarkTicker;
            })
          });

          this.setState({
            primaryStock: {
              name: this.state.returnedData[developedStockIndex].ticker,
              data: this.state.returnedData[developedStockIndex].yAxis,
              color:
                this.state.returnedData[developedStockIndex].returnPercent >= 0
                  ? "green"
                  : "red"
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
              plotSeries: [this.state.primaryStock, this.state.benchmarkData]
            });
          } else {
            this.setState({
              plotSeries: [this.state.primaryStock]
            });
          }

          // Start building chart here
          if (developedStockIndex !== -1) {
            const units = this.state.axisUnits;

            Highcharts.chart("developedStock", {
              legend: { enabled: this.state.legendShow },
              title: {
                text: `${
                  this.state.returnedData[developedStockIndex].ticker
                }: ${this.state.returnedData[developedStockIndex].name}`
              },
              xAxis: [
                {
                  minPadding: 0.05,
                  maxPadding: 0.05,
                  tickInterval: changeAxis,
                  categories: this.state.returnedData[developedStockIndex].xAxis
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
                        x: this.state.returnedData[developedStockIndex]
                          .xLastPoint,
                        y: 0,
                        xAxis: 0
                        // yAxis: 0
                      },

                      // LOGIC: if user interval selected is 5y, then show annualized roi, otherwise, just show ROI.
                      // If a benchmark is selected also show annualized ROI or just ROI depending on user inderval.
                      text: `Value: $${
                        this.state.returnedData[developedStockIndex]
                          .currentPrice
                      }
                      ${
                        userInterval === "5y"
                          ? `<br>Annualized ROI: ${this.state.returnedData[
                              developedStockIndex
                            ].annualizedReturn.toFixed(2)}%`
                          : `<br>ROI: ${
                              this.state.returnedData[developedStockIndex]
                                .returnPercent
                            }%`
                      }
                      
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
            <h2>International Developed Market Stocks</h2>
            <p>
              This set of holdings offers exposure to a broad collection of
              stocks from non-U.S. developed markets such as the United Kingdom,
              the European Union, Japan, and others. Generally, developed market
              stocks have a similar risk and return profile as the U.S. Total
              Stock Market. Greater portfolio diversification can be achieved
              with allocations to emerging market stocks and bonds in addition
              to international developed market stocks.
            </p>
            <br />
            <p>
              The SPDR S&P 500 ETF Trust provides a good performance benchmark
              as the standard alternative for the average US investor. Although
              the international developed market stocks have a similar business
              cycle and risk performance profile, foreign company stock
              performance has an inverse relationship to the performance of the
              US Dollar relative to developed market currencies such as the
              Euro, Yen, Canadian dollar, British Pound, and Swiss Francs. As a
              result, the US investor might consider hedging against such an
              effect by adding a bullish US Dollar ETF such as Invesco DB U.S.
              Dollar Index Bullish Fund (UUP) to his portfolio.
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
                      addBenchmark: false,
                      legendShow: false
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
                        this.state.benchmarkTicker === "UUP" &&
                        this.state.addBenchmark
                          ? "active"
                          : ""
                      }`}
                      type="button"
                      onClick={() => {
                        this.plotBenchmark("UUP");
                      }}
                    >
                      US Dollar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="row"
              id="developedStock"
              style={{ height: "400px" }}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default DevelopedStock;
