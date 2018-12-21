import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import Highcharts from "highcharts";
import moment from "moment-timezone";

class EmergingStock extends Component {
  constructor(props) {
    super(props);

    this.updateQuotes = this.updateQuotes.bind(this);
    this.getGlobalQuotes = this.getGlobalQuotes.bind(this);
    this.plotBenchmark = this.plotBenchmark.bind(this);

    this.state = {
      tickers: [
        { ticker: "SPY", name: "SPDR S&P 500 ETF Trust" },
        { ticker: "IEMG", name: "iShares Core MSCI Emerging Markets" },
        {
          ticker: "USDU",
          name: "WisdomTree Bloomberg U.S. Dollar Bullish Fund"
        },
        { ticker: "VBR", name: "Vanguard Small-Cap Value ETF" }
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
        changeAxis = 20;
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

          // Adjust return to date key if user selects 1 day interval since API object is different for minute data
          if (userInterval === "1d") {
            returntoDate =
              res.data[res.data.length - 1].marketChangeOverTime * 100;
            lastPrice = res.data[res.data.length - 1].marketClose;
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

          tempValues.push(indexData);

          this.setState({
            returnedData: tempValues
          });

          let developedStockIndex = tempValues.findIndex(element => {
            return element.ticker === "IEMG";
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

            Highcharts.chart("emergingStock", {
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
            <h2>Emerging Market Stocks</h2>
            <p>
              This set of holdings offers exposure to a broad collection of
              stocks from emerging markets, such as China, Taiwan, India,
              Brazil, Russia, Thailand, and South Africa, among others.
              International Emerging Market Stocks generally involve higher
              expected risk compared to Developed Market Stocks, but may lead to
              higher growth as developing states modernize and gain wealth.
              Emerging market stocks are less correlated with U.S. Stocks and
              other developed market stocks, which makes them an important part
              of a diversified portfolio. A more natural US investment
              alternative would be a small cap stock ETF such as the Vanguard
              Small-Cap Value ETF to gain exposure to high growth, but more
              volatile equities.
            </p>
            <br />
            <p>
              Similarly to the developed market ETF, the emerging market stocks
              ETF performance is counter cyclical to the US dollar. The
              WisdomTree Bloomberg U.S. Dollar Bullish Fund offers a good hedge
              to US dollar fluctuations with broad exposure to both devopped and
              emerging market currencies.
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
                        this.state.benchmarkTicker === "VBR" &&
                        this.state.addBenchmark
                          ? "active"
                          : ""
                      }`}
                      type="button"
                      onClick={() => {
                        this.plotBenchmark("VBR");
                      }}
                    >
                      US Small Cap Stocks
                    </button>
                    <button
                      className={`dropdown-item ${
                        this.state.benchmarkTicker === "USDU" &&
                        this.state.addBenchmark
                          ? "active"
                          : ""
                      }`}
                      type="button"
                      onClick={() => {
                        this.plotBenchmark("USDU");
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
              id="emergingStock"
              style={{ height: "400px" }}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default EmergingStock;
