import React, { Component } from "react";
import "./Ticker.css";
import API from "../../utils/API";

class Ticker extends Component {
  constructor(props) {
    super(props);

    this.getIndexQuotes = this.getIndexQuotes.bind(this);

    this.state = {
      DOW: 0,
      SNP: 0
    };
  }

  componentDidMount() {
    this.getIndexQuotes();
  }

  getIndexQuotes() {
    const indices = {
      DOW: "DIA",
      SNP: "SPY"
    };

    API.getIndexQuotes(indices)
      .then(res => {
        console.log(res.data);
        this.setState({
          SNP: res.data.SPY.quote.changePercent * 100,
          DOW: res.data.DIA.quote.changePercent * 100
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="row tickerRow">
        <ul className="tickerRowText d-flex flex-row w-100">
          <li className="mx-auto .tickerSymbol">
            SPY: {`${this.state.SNP.toFixed(2)}%`}
          </li>
          <li className="mx-auto .tickerSymbol">
            DIA: {`${this.state.DOW.toFixed(2)}%`}
          </li>
          <li className="mx-auto .tickerSymbol">
            Nasdaq: {`${this.state.DOW.toFixed(2)}%`}
          </li>
          <li className="mx-auto .tickerSymbol">
            U.S. 10-yr: {`${this.state.DOW.toFixed(2)}%`}
          </li>
          <li className="mx-auto .tickerSymbol">
            <i className="fas fa-dollar-sign" />
            /BTC: {`${this.state.DOW.toFixed(2)}%`}
          </li>
          <li className="mx-auto .tickerSymbol">
            <i className="fas fa-euro-sign" />/
            <i className="fas fa-dollar-sign" />:{" "}
            {`${this.state.DOW.toFixed(2)}%`}
          </li>
          <li className="mx-auto .tickerSymbol">
            <i className="fas fa-yen-sign" />/
            <i className="fas fa-dollar-sign" />:{" "}
            {`${this.state.DOW.toFixed(2)}%`}
          </li>
        </ul>
      </div>
    );
  }
}

export default Ticker;
