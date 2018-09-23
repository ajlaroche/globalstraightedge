import React, { Component } from "react";
import "./Ticker.css";
import API from "../../utils/API";

class Ticker extends Component {
  componentDidMount() {
    this.getIndexQuotes();
  }

  getIndexQuotes() {
    API.getIndexQuotes()
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="row tickerRow">
        <p className="tickerRowText">S&P 500, Dow,</p>
      </div>
    );
  }
}

export default Ticker;
