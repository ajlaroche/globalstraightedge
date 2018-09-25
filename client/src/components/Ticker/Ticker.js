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
        <p className="tickerRowText">
          SPY: {`${this.state.SNP.toFixed(2)}%`} DIA:
          {`${this.state.DOW.toFixed(2)}%`}
        </p>
      </div>
    );
  }
}

export default Ticker;
