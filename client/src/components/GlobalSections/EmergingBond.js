import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import Highcharts from "highcharts";
import moment from "moment-timezone";

class EmergingBond extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tickers: [
        { ticker: "SPY", name: "SPDR S&P 500 ETF Trust" },
        { ticker: "VWOB", name: "Vanguard Emerging Markets Government Bond" }
      ],
      interval: "1m",
      returnedData: [],
      dayOfWeek: 0
    };
  }

  componentDidMount() {
    this.getGlobalQuotes(this.state.interval);
  }

  updateQuotes(userInterval) {
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
      this.getGlobalQuotes(userInterval);
    } else {
      this.setState({
        interval: userInterval
      });
      this.getGlobalQuotes(userInterval);
    }
  }

  getGlobalQuotes(userInterval) {
    this.setState({
      returnedData: []
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
              dataPoint = point.marketClose;
            } else {
              timeScale = point.date;
              dataPoint = point.close;
            }
            categories.push(timeScale);
            values.push(dataPoint);
          });

          indexData = {
            ticker: element.ticker,
            name: element.name,
            xAxis: categories,
            yAxis: values
          };
          console.log(indexData);
          tempValues.push(indexData);
          this.setState({
            returnedData: tempValues
          });

          let developedStockIndex = tempValues.findIndex(element => {
            return element.ticker === "VWOB";
          });

          if (developedStockIndex !== -1) {
            Highcharts.chart("emergingBond", {
              legend: { enabled: false },
              title: {
                text: `${
                  this.state.returnedData[developedStockIndex].ticker
                }: ${this.state.returnedData[developedStockIndex].name}`
              },
              xAxis: {
                minPadding: 0.05,
                maxPadding: 0.05,
                tickInterval: changeAxis,
                categories: this.state.returnedData[developedStockIndex].xAxis
              },
              yAxis: {
                title: { text: "$ per share" }
                // tickInterval: 1
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
                  name: this.state.returnedData[developedStockIndex].ticker,
                  data: this.state.returnedData[developedStockIndex].yAxis
                }
              ]
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
            <h2>Emerging Market Bonds</h2>
            <p>
              International Emerging Markets Bonds are dollar-denominated bonds
              issued by governments with economies that are rapidly growing and
              industrializing. This component offers higher expected returns
              than other types of bonds in the portfolio due to higher expected
              risk. Their unusually low correlation with other bonds results in
              higher risk-adjusted expected performance for the bond portion of
              a portfolio.
            </p>
          </article>
          <div className="col-md-6">
            <div className="row">
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
            <div
              className="row"
              id="emergingBond"
              style={{ height: "400px" }}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default EmergingBond;
