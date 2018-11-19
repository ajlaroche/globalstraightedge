import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import Highcharts from "highcharts";

class DevelopedStock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tickers: ["VEA", "IEMG", "BNDX", "EMB"],
      interval: "1m",
      returnedData: []
    };
  }

  componentDidMount() {
    this.getGlobalQuotes(this.state.interval);
  }

  updateQuotes(userInterval) {
    console.log(userInterval);
    this.setState({
      interval: userInterval
    });
    this.getGlobalQuotes(userInterval);
  }

  getGlobalQuotes(userInterval) {
    this.setState({
      returnedData: []
    });

    let tempValues = [];

    this.state.tickers.forEach(element => {
      API.getGlobalIndex({ ticker: element, interval: userInterval })
        .then(res => {
          let categories = [];
          let values = [];
          let indexData = {};
          // console.log(res.data);
          res.data.forEach(point => {
            categories.push(point.date);
            values.push(point.close);
          });

          indexData = {
            ticker: element,
            xAxis: categories,
            yAxis: values
          };
          console.log(indexData);
          tempValues.push(indexData);
          this.setState({
            returnedData: tempValues
          });

          let developedStockIndex = tempValues.findIndex(element => {
            return element.ticker === "VEA";
          });

          if (developedStockIndex !== -1) {
            Highcharts.chart("developedStock", {
              legend: { enabled: false },
              title: {
                text: this.state.returnedData[developedStockIndex].ticker
              },
              xAxis: {
                minPadding: 0.05,
                maxPadding: 0.05,
                // tickInterval: 2,
                categories: this.state.returnedData[
                  developedStockIndex
                ].xAxis.reverse()
              },
              yAxis: {
                title: { text: "$ per share" },
                tickInterval: 1
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
                  data: this.state.returnedData[
                    developedStockIndex
                  ].yAxis.reverse()
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
