import React, { Component } from "react";
import "./Dashboards.css";
import API from "../../utils/API";
import moment from "moment";

class USEconomy extends Component {
  constructor(props) {
    super(props);

    this.getUnemployment = this.getUnemployment.bind(this);

    this.state = {
      unemployment: 0
    };
  }

  componentDidMount() {
    this.getUnemployment();
  }

  getUnemployment() {
    API.getUnemployment()
      .then(res => {
        console.log(res.data);
        this.setState({
          unemployment: res.data.observations[0].value
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="col-lg-8 dashboard">
        <div className="row">
          <h2>US Economy At A Glance</h2>
        </div>
        <div className="row metricsRow">
          <div className="col-lg-2 metricBox">
            <h5>Unemployment</h5>
            <h5>{this.state.unemployment}%</h5>
          </div>
          <div className="col-lg-2 metricBox">
            <h5>GDP Growth</h5>
          </div>
          <div className="col-lg-2 metricBox">
            <h5>CPI</h5>
          </div>
          <div className="col-lg-2 metricBox">
            <h5>Yield Curve</h5>
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
