import React, { Component } from "react";
import "./Ticker.css";
import API from "../../utils/API";

class Ticker extends Component {
  constructor(props) {
    super(props);

    this.getIndexQuotes = this.getIndexQuotes.bind(this);
    this.getForexQuotes = this.getForexQuotes.bind(this);

    this.state = {
      DOW: { price: 0, change: 0 },
      SNP: { price: 0, change: 0 },
      NAS: { price: 0, change: 0 },
      BTC: { price: 0, change: 0 }
    };
  }

  componentDidMount() {
    this.getIndexQuotes();
    this.getForexQuotes();
  }

  getIndexQuotes() {
    const indices = {
      DOW: "DIA",
      SNP: "SPY",
      NAS: "ONEQ",
      BTC: "BTCUSDT"
    };

    API.getIndexQuotes(indices)
      .then(res => {
        console.log(res.data);
        this.setState({
          SNP: {
            change: res.data.SPY.quote.changePercent * 100,
            price: res.data.SPY.quote.latestPrice
          },
          DOW: {
            change: res.data.DIA.quote.changePercent * 100,
            price: res.data.DIA.quote.latestPrice
          },
          NAS: {
            change: res.data.ONEQ.quote.changePercent * 100,
            price: res.data.ONEQ.quote.latestPrice
          },
          BTC: {
            change: res.data.BTCUSDT.quote.changePercent * 100,
            price: res.data.BTCUSDT.quote.latestPrice
          }
        });
      })
      .catch(err => console.log(err));
  }

  getForexQuotes() {
    const currency = ["EUR", "YEN"];

    currency.forEach(element => {
      API.getForexQuotes(element)
        .then(res => {
          console.log(res.data);
        })
        .catch(err => console.log(err));
    });
  }

  render() {
    const upArrow = " fal fa-arrow-up";
    const downArrow = "fal fa-arrow-down";
    return (
      <div className="row tickerRow">
        <ul className="tickerRowText d-flex flex-row w-100">
          <li className="mx-auto .tickerSymbol">
            SPY{" "}
            <span
              style={{ fontWeight: "bold" }}
            >{`${this.state.SNP.price.toFixed(2)}  `}</span>
            <span
              style={
                this.state.SNP.change < 0
                  ? { color: "red" }
                  : { color: "green" }
              }
            >
              {`${this.state.SNP.change.toFixed(2)}% `}
              <i className={this.state.SNP.change < 0 ? downArrow : upArrow} />
            </span>
          </li>
          <li className="mx-auto .tickerSymbol">
            DIA{" "}
            <span
              style={{ fontWeight: "bold" }}
            >{`${this.state.DOW.price.toFixed(2)}  `}</span>
            <span
              style={
                this.state.DOW.change < 0
                  ? { color: "red" }
                  : { color: "green" }
              }
            >
              {`${this.state.DOW.change.toFixed(2)}% `}
              <i className={this.state.DOW.change < 0 ? downArrow : upArrow} />
            </span>
          </li>
          <li className="mx-auto .tickerSymbol">
            ONEQ{" "}
            <span
              style={{ fontWeight: "bold" }}
            >{`${this.state.NAS.price.toFixed(2)}  `}</span>
            <span
              style={
                this.state.NAS.change < 0
                  ? { color: "red" }
                  : { color: "green" }
              }
            >
              {`${this.state.NAS.change.toFixed(2)}% `}
              <i className={this.state.NAS.change < 0 ? downArrow : upArrow} />
            </span>
          </li>
          <li className="mx-auto .tickerSymbol">
            U.S. 10-yr:{" "}
            <span
              style={{ fontWeight: "bold" }}
            >{`${this.state.DOW.price.toFixed(2)}  `}</span>
            <span
              style={
                this.state.DOW.change < 0
                  ? { color: "red" }
                  : { color: "green" }
              }
            >
              {`${this.state.DOW.change.toFixed(2)}% `}
              <i className={this.state.SNP.change < 0 ? downArrow : upArrow} />
            </span>
          </li>
          <li className="mx-auto .tickerSymbol">
            <i className="fal fa-dollar-sign" />
            /BTC{" "}
            <span
              style={{ fontWeight: "bold" }}
            >{`${this.state.BTC.price.toFixed(2)}  `}</span>
            <span
              style={
                this.state.BTC.change < 0
                  ? { color: "red" }
                  : { color: "green" }
              }
            >
              {`${this.state.BTC.change.toFixed(2)}% `}
              <i className={this.state.BTC.change < 0 ? downArrow : upArrow} />
            </span>
          </li>
          <li className="mx-auto .tickerSymbol">
            <i className="fal fa-dollar-sign" />/
            <i className="fal fa-euro-sign" />:{" "}
            <span
              style={{ fontWeight: "bold" }}
            >{`${this.state.DOW.price.toFixed(2)}  `}</span>
            <span
              style={
                this.state.DOW.change < 0
                  ? { color: "red" }
                  : { color: "green" }
              }
            >
              {`${this.state.DOW.change.toFixed(2)}% `}
              <i className={this.state.SNP.change < 0 ? downArrow : upArrow} />
            </span>
          </li>
          <li className="mx-auto .tickerSymbol">
            <i className="fal fa-yen-sign" />/
            <i className="fal fa-dollar-sign" />:{" "}
            <span
              style={{ fontWeight: "bold" }}
            >{`${this.state.DOW.price.toFixed(2)}  `}</span>
            <span
              style={
                this.state.DOW.change < 0
                  ? { color: "red" }
                  : { color: "green" }
              }
            >
              {`${this.state.DOW.change.toFixed(2)}% `}
              <i className={this.state.SNP.change < 0 ? downArrow : upArrow} />
            </span>
          </li>
        </ul>
      </div>
    );
  }
}

export default Ticker;
