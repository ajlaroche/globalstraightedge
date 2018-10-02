import React, { Component } from "react";
import "./Dashboards.css";
import API from "../../utils/API";
import moment from "moment";

class USEconomy extends Component {
  render() {
    return (
      <div className="col-lg-8 dashboard">
        <div className="row">
          <h2>US Economy At A Glance</h2>
        </div>
        <div className="row metricsRow">
          <div className="col-lg-2 metricBox">
            <h5>Unemployment</h5>
          </div>
          <div className="col-lg-2 metricBox">
            <h5>GDP Growth</h5>
          </div>
          <div className="col-lg-2 metricBox">
            <h5>CPI</h5>
          </div>
          <div className="col-lg-2 metricBox">
            <h5>Productivity</h5>
          </div>
          <div className="col-lg-2 metricBox">
            <h5>Wages</h5>
          </div>
          <div className="col-lg-2 metricBox">
            <h5>Net Trade Balance</h5>
          </div>
        </div>
      </div>
    );
  }
}

export default USEconomy;
