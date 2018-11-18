import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import Highcharts from "highcharts";

class DevelopedStock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tickers: ["VEA", "IEMG", "BNDX", "EMB"],
      interval: "dynamic",
      returnedData: []
    };
  }

  componentDidMount() {
    this.getGlobalQuotes();
  }

  getGlobalQuotes() {
    const dataInterval = this.state.interval;
    this.state.tickers.forEach(element => {
      API.getGlobalIndex({ ticker: element, interval: dataInterval })
        .then(res => {
          let categories = [];
          let values = [];
          let indexData = {};
          // console.log(res.data);
          res.data.data.forEach(point => {
            categories.push(point.date);
            values.push(point.close);
          });

          indexData = {
            ticker: element,
            xAxis: categories,
            yAxis: values
          };
          console.log(indexData);
          this.state.returnedData.push(indexData);

          Highcharts.chart("developedStock", {
            legend: { enabled: false },
            title: { text: this.state.returnedData[0].ticker },
            xAxis: {
              minPadding: 0.05,
              maxPadding: 0.05,
              tickInterval: 2,
              categories: this.state.returnedData[0].xAxis.reverse()
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
                data: this.state.returnedData[0].yAxis.reverse()
              }
            ]
          });
        })
        .catch(err => console.log(err));

      console.log(this.state.returnedData);
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
              <h6>Hourly | Daily | Monthly | Yearly</h6>
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
