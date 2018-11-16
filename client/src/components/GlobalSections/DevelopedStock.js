import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";

class DevelopedStock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tickers: ["VEA", "IEMG", "BNDX", "EMB"],
      interval: "dynamic"
    };
  }

  componentDidMount() {
    this.getGlobalQuotes();
  }

  getGlobalQuotes() {
    const dataInterval = this.state.interval;
    const returnedData = [];
    this.state.tickers.forEach(element => {
      API.getGlobalIndex({ ticker: element, interval: dataInterval }).then(
        res => {
          // console.log(res.data);
          let categories = [];
          let values = [];
          res.data.data.forEach(element => {
            categories.push(element.date);
            values.push(element.close);
          });
          returnedData.push({
            ticker: element,
            xAxis: categories,
            yAxis: values
          });
        }
      );
    });
    console.log(returnedData);
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
