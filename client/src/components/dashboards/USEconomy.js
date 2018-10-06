import React, { Component } from "react";
import "./Dashboards.css";
import API from "../../utils/API";
import moment from "moment";

class USEconomy extends Component {
  constructor(props) {
    super(props);

    this.getEconomicData = this.getEconomicData.bind(this);

    this.state = {
      unemployment: 0,
      unemploymentDate: "",
      unemploymentChange: 0,
      gdp: 0,
      gdpQuarter: "",
      gdpYear: "",
      gdpChange: 0
    };
  }

  componentDidMount() {
    this.getEconomicData();
  }

  getEconomicData() {
    API.getUnemployment()
      .then(res => {
        console.log(res.data);
        this.setState({
          unemployment: res.data.observations[0].value,
          unemploymentDate: res.data.observations[0].date,
          unemploymentChange:
            parseFloat(res.data.observations[0].value) -
            parseFloat(res.data.observations[1].value)
        });
      })
      .catch(err => console.log(err));

    API.getGDP()
      .then(res => {
        console.log(res.data);
        this.setState({
          gdp: res.data.observations[0].value,
          gdpQuarter: Math.ceil(
            parseInt(moment(res.data.observations[0].date).format("MM")) / 3
          ),
          gdpYear: moment(res.data.observations[0].date).format("YYYY"),
          gdpChange:
            parseFloat(res.data.observations[0].value) -
            parseFloat(res.data.observations[1].value)
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const upArrow = " fal fa-arrow-up";
    const downArrow = "fal fa-arrow-down";
    return (
      <div className="col-lg-8 dashboard">
        <div className="row">
          <h2>US Economy At A Glance</h2>
        </div>
        <div className="row metricsRow">
          <div className="col-lg-2 metricBox">
            <h5>Unemployment</h5>
            <h5>
              {this.state.unemployment}%{" "}
              <span
                style={
                  this.state.unemploymentChange > 0
                    ? { color: "red" }
                    : { color: "green" }
                }
              >
                <i
                  className={
                    this.state.unemploymentChange < 0 ? downArrow : upArrow
                  }
                />
              </span>
            </h5>
            <h6>
              <i>{moment(this.state.unemploymentDate).format("MMMM, YYYY")}</i>{" "}
            </h6>
          </div>
          <div className="col-lg-2 metricBox">
            <h5>GDP Growth</h5>
            <h5>
              {this.state.gdp}%{" "}
              <span
                style={
                  this.state.gdpChange < 0
                    ? { color: "red" }
                    : { color: "green" }
                }
              >
                <i className={this.state.gdpChange < 0 ? downArrow : upArrow} />
              </span>
            </h5>
            <h6>
              <i>{`${this.state.gdpQuarter}Q${this.state.gdpYear}`}</i>{" "}
            </h6>
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
