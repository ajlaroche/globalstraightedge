import React, { Component } from "react";
import "./Dashboards.css";
import API from "../../utils/API";
import moment from "moment";
import Highcharts from "highcharts";

class USEconomy extends Component {
  constructor(props) {
    super(props);

    this.getEconomicData = this.getEconomicData.bind(this);

    this.state = {
      unemployment: 0,
      unemploymentDate: "",
      unemploymentChange: 0,
      unemploymentDataSet: {},
      gdp: 0,
      gdpQuarter: "",
      gdpYear: "",
      gdpChange: 0,
      gdpDataSet: {},
      cpi: 0,
      cpiDate: "",
      cpiDataSet: {},
      yieldSpread: 0,
      yieldSpreadDate: "",
      yieldSpreadChange: 0,
      wageGrowth: 0,
      wageGrowthDate: "",
      wageGrowthChange: 0,
      tradeBalance: 0,
      tradeBalanceQuarter: "",
      tradeBalanceYear: "",
      tradeBalanceChange: 0
    };
  }

  componentDidMount() {
    this.getEconomicData();
  }

  getEconomicData() {
    API.getUnemployment()
      .then(res => {
        let dataSetCategories = [];
        let dataSetPoints = [];
        res.data.observations.forEach(element => {
          dataSetCategories.push(moment(element.date).format("MM-YY"));
          dataSetPoints.push(parseFloat(element.value));
        });
        this.setState({
          unemployment: res.data.observations[0].value,
          unemploymentDate: res.data.observations[0].date,
          unemploymentChange:
            parseFloat(res.data.observations[0].value) -
            parseFloat(res.data.observations[1].value),
          unemploymentDataSet: {
            categories: dataSetCategories,
            values: dataSetPoints
          }
        });
        console.log(this.state.unemploymentDataSet);

        Highcharts.chart("unemploymentChart", {
          legend: { enabled: false },
          title: { text: undefined },
          xAxis: {
            minPadding: 0.05,
            maxPadding: 0.05,
            categories: this.state.unemploymentDataSet.categories.reverse()
          },
          yAxis: {
            title: { enabled: false }
          },
          plotOptions: {
            line: {
              marker: {
                enabled: false
              }
            }
          },
          series: [
            {
              data: this.state.unemploymentDataSet.values.reverse()
            }
          ]
        });
      })
      .catch(err => console.log(err));

    API.getGDP()
      .then(res => {
        let dataSetCategories = [];
        let dataSetPoints = [];
        res.data.observations.forEach(element => {
          dataSetCategories.push(
            `${Math.ceil(
              parseInt(moment(element.date).format("MM"), 10) / 3
            )}Q${moment(element.date).format("YY")}`
          );
          dataSetPoints.push(parseFloat(element.value));
        });
        this.setState({
          gdp: res.data.observations[0].value,
          gdpQuarter: Math.ceil(
            parseInt(moment(res.data.observations[0].date).format("MM"), 10) / 3
          ),
          gdpYear: moment(res.data.observations[0].date).format("YYYY"),
          gdpChange:
            parseFloat(res.data.observations[0].value) -
            parseFloat(res.data.observations[1].value),
          gdpDataSet: {
            categories: dataSetCategories,
            values: dataSetPoints
          }
        });
        console.log(this.state.gdpDataSet);

        Highcharts.chart("gdpChart", {
          legend: { enabled: false },
          title: { text: undefined },
          xAxis: {
            minPadding: 0.05,
            maxPadding: 0.05,
            categories: this.state.gdpDataSet.categories.reverse()
          },
          yAxis: {
            title: { enabled: false }
          },
          plotOptions: {
            line: {
              marker: {
                enabled: false
              }
            }
          },
          series: [
            {
              data: this.state.gdpDataSet.values.reverse()
            }
          ]
        });
      })
      .catch(err => console.log(err));

    API.getCPI()
      .then(res => {
        let dataSetCategories = [];
        let dataSetPoints = [];
        res.data.observations.forEach(element => {
          dataSetCategories.push(moment(element.date).format("MM-YY"));
          dataSetPoints.push(parseFloat(element.value));
        });
        this.setState({
          cpi: parseFloat(res.data.observations[0].value),
          cpiDate: res.data.observations[0].date,
          cpiDataSet: {
            categories: dataSetCategories,
            values: dataSetPoints
          }
        });
        Highcharts.chart("cpiChart", {
          legend: { enabled: false },
          title: { text: undefined },
          xAxis: {
            minPadding: 0.05,
            maxPadding: 0.05,
            categories: this.state.cpiDataSet.categories.reverse()
          },
          yAxis: {
            title: { enabled: false }
          },
          plotOptions: {
            line: {
              marker: {
                enabled: false
              }
            }
          },
          series: [
            {
              data: this.state.cpiDataSet.values.reverse()
            }
          ]
        });
      })
      .catch(err => console.log(err));

    API.getYieldSpread()
      .then(res => {
        this.setState({
          yieldSpread: parseFloat(res.data.observations[0].value),
          yieldSpreadDate: res.data.observations[0].date,
          yieldSpreadChange:
            parseFloat(res.data.observations[0].value) -
            parseFloat(res.data.observations[1].value)
        });
      })
      .catch(err => console.log(err));

    API.getWageGrowth()
      .then(res => {
        this.setState({
          wageGrowth: parseFloat(res.data.observations[0].value),
          wageGrowthDate: res.data.observations[0].date,
          wageGrowthChange:
            parseFloat(res.data.observations[0].value) -
            parseFloat(res.data.observations[1].value)
        });
      })
      .catch(err => console.log(err));

    API.getTradeBalance()
      .then(res => {
        this.setState({
          tradeBalance: parseFloat(res.data.observations[0].value),
          tradeBalanceQuarter: Math.ceil(
            parseInt(moment(res.data.observations[0].date).format("MM"), 10) / 3
          ),
          tradeBalanceYear: moment(res.data.observations[0].date).format(
            "YYYY"
          ),
          tradeBalanceChange:
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
      <div className="col-lg-10 mx-auto dashboard">
        <div className="row">
          <h2>US Economy At A Glance</h2>
        </div>
        <div className="row metricsRow">
          <div className="col-md-2 metricBox">
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
          <div className="col-md-2 metricBox">
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
          <div className="col-md-2 metricBox">
            <h5>CPI</h5>
            <h5>{`${this.state.cpi.toFixed(1)}%`}</h5>
            <h6>
              <i>{moment(this.state.cpiDate).format("MMMM, YYYY")}</i>
            </h6>
          </div>
          <div className="col-md-2 metricBox">
            <h5>Yield Curve</h5>
            <h5>
              {this.state.yieldSpread}%{" "}
              <span
                style={
                  this.state.yieldSpreadChange < 0
                    ? { color: "red" }
                    : { color: "green" }
                }
              >
                <i
                  className={
                    this.state.yieldSpreadChange < 0 ? downArrow : upArrow
                  }
                />
              </span>
            </h5>
            <h6>
              <i>
                {moment(this.state.yieldSpreadDate).format("MMMM DD, YYYY")}
              </i>{" "}
            </h6>
          </div>
          <div className="col-md-2 metricBox">
            <h5>Wages</h5>
            <h5>
              {this.state.wageGrowth.toFixed(1)}%{" "}
              <span
                style={
                  this.state.wageGrowthChange < 0
                    ? { color: "red" }
                    : { color: "green" }
                }
              >
                <i
                  className={
                    this.state.wageGrowthChange < 0 ? downArrow : upArrow
                  }
                />
              </span>
            </h5>
            <h6>
              <i>{moment(this.state.wageGrowthDate).format("MMMM, YYYY")}</i>{" "}
            </h6>
          </div>
          <div className="col-md-2 metricBox">
            <h5>Net Trade Balance</h5>
            <h5>
              {this.state.tradeBalance.toFixed(0)}B{" "}
              <span
                style={
                  this.state.tradeBalanceChange < 0
                    ? { color: "red" }
                    : { color: "green" }
                }
              >
                <i
                  className={
                    this.state.tradeBalanceChange < 0 ? downArrow : upArrow
                  }
                />
              </span>
            </h5>
            <h6>
              <i>{`${this.state.tradeBalanceQuarter}Q${
                this.state.tradeBalanceYear
              }`}</i>{" "}
            </h6>
          </div>
        </div>
        <div className="row">
          <div className="col-md-2 dashboardGraph" id="unemploymentChart" />
          <div className="col-md-2 dashboardGraph" id="gdpChart" />
          <div className="col-md-2 dashboardGraph" id="cpiChart" />
        </div>
      </div>
    );
  }
}

export default USEconomy;
