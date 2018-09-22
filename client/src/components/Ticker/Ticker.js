import React, { Component } from "react";
import "./Ticker.css";
import Row from "../Grid/Row";

class Ticker extends Component {
  render() {
    const symbols = [];

    return (
      <div className="row tickerRow">
        <p className="tickerRowText">S&P 500, Dow,</p>
      </div>
    );
  }
}

export default Ticker;
