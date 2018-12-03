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

    this.state = {
      tickers: [
        { ticker: "VEA", name: "Vanguard FTSE Developed Markets" },
        { ticker: "SPY", name: "SPDR S&P 500 ETF Trust" }
        // { ticker: "IEMG", name: "iShares Core MSCI Emerging Markets" },
        // { ticker: "BNDX", name: "Vanguard Total International Bond" },
        // { ticker: "EMB", name: "iShares Emerging Markets USD Bond" }
      ],
      interval: "1m",
      priceView: "price",
      axisTitle: "$ per Share",
      axisUnits: "",
      returnedData: [],
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

  getGlobalQuotes(userInterval, dataType) {
    this.setState({
      returnedData: [],
      interval: userInterval,
      priceView: dataType
    });

    // Adjust x axis depending on user selected time interval
    let changeAxis = 1;

    switch (userInterval) {
      case "1d":
        changeAxis = 10;
        break;
      case "1m":
        changeAxis = 1;
        break;
      case "1y":
        changeAxis = 10;
        break;
      case "5y":
        changeAxis = 60;
        break;
      default:
        changeAxis = 1;
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
            xAxis: categories,
            yAxis: values,
            xLastPoint: categories[categories.length - 1],
            yLastPoint: values[values.length - 1]
          };
          console.log(indexData);
          tempValues.push(indexData);
          this.setState({
            returnedData: tempValues
          });

          let developedStockIndex = tempValues.findIndex(element => {
            return element.ticker === "VEA";
          });

          // Start building chart here
          if (developedStockIndex !== -1) {
            const units = this.state.axisUnits;

            Highcharts.chart("developedStock", {
              legend: { enabled: false },
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

              plotOptions: {
                line: {
                  marker: {
                    enabled: false
                  }
                }
              },
              series: [
                {
                  name: this.state.returnedData[developedStockIndex].ticker,
                  data: this.state.returnedData[developedStockIndex].yAxis
                }
              ],
              annotations: [
                {
                  labels: [
                    {
                      point: {
                        // xAxis: 0,
                        yAxis: 0,
                        x: this.state.returnedData[developedStockIndex]
                          .xLastPoint,
                        y: this.state.returnedData[developedStockIndex]
                          .yLastPoint
                      },
                      text: "Label"
                    }
                  ]
                }
              ]

              // annotations: [
              //   {
              //     labelOptions: {
              //       backgroundColor: "rgba(255,255,255,0.5)",
              //       verticalAlign: "top",
              //       y: 1
              //     },
              //     labels: [
              //       {
              //         point: {
              //           xAxis: 0,
              //           yAxis: 0,
              //           x: this.state.returnedData[developedStockIndex]
              //             .xLastPoint,
              //           y: this.state.returnedData[developedStockIndex]
              //             .yLastPoint
              //         },
              //         text: "label"
              //       }
              //     ]
              //   }
              // ]
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
          </article>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-9">
                <h6>
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={this.updateQuotes.bind(this, "1d")}
                  >
                    1 Day
                  </button>
                  |{" "}
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={this.updateQuotes.bind(this, "1m")}
                  >
                    1 Month
                  </button>{" "}
                  |{" "}
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={this.updateQuotes.bind(this, "1y")}
                  >
                    1 Year
                  </button>{" "}
                  |{" "}
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={this.updateQuotes.bind(this, "5y")}
                  >
                    5 Year
                  </button>
                </h6>
              </div>
              <div className="col-md-3">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => {
                    this.updateQuotes(this.state.interval, "price");
                    this.setState({ axisTitle: "$ per Share" });
                    this.setState({ axisUnits: "" });
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
                    this.setState({ axisTitle: "relative change" });
                    this.setState({ axisUnits: "%" });
                  }}
                >
                  %Change
                </button>
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
