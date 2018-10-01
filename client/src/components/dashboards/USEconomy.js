import React, { Component } from "react";
import "./Dashboards.css";
import API from "../../utils/API";
import moment from "moment";

class USEconomy extends Component {
  render() {
    return (
      <div className="container-fluid dashboard">
        <div className="row">
          <h2>US Economy At A Glance</h2>
        </div>
        <div className="row metricsRow">
          <div className="col-lg-3">
            <h4>Unemployment</h4>
          </div>
        </div>
      </div>
    );
  }
}

export default USEconomy;
