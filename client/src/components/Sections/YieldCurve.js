import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import moment from "moment";
import Highcharts from "highcharts";

class YieldCurve extends Component {
  constructor(props) {
    super(props);

    this.getYieldCurve = this.getYieldCurve.bind(this);

    this.state = {
      currentCurve: [],
      priorMonthCurve: []
    };
  }

  componentDidMount() {
    this.getYieldCurve();
  }

  getYieldCurve() {
    const current = [];

    const prior = [];

    API.getYieldCurve().then(res => {
      const curveData = res.data;

      current.push(
        curveData.threeMonth[0],
        curveData.twoYear[0],
        curveData.tenYear[0],
        curveData.thirtyYear[0]
      );

      prior.push(
        curveData.threeMonth[1],
        curveData.twoYear[1],
        curveData.tenYear[1],
        curveData.thirtyYear[1]
      );
      // console.log(current);
      // console.log(prior);

      this.setState({
        currentCurve: current,
        priorMonthCurve: prior
      });

      const terms = ["3-month", "2-year", "10-year", "30-year"];

      Highcharts.chart("yieldCurveChart", {
        title: { text: "The Yield Curve" },
        xAxis: {
          minPadding: 0.05,
          maxPadding: 0.05,
          categories: terms
        },
        yAxis: {
          title: { text: "%" },
          tickInterval: 0.5
        },
        plotOptions: {
          line: {
            marker: {
              enabled: false
            }
          }
        },
        legend: {
          layout: "vertical",
          align: "right",
          verticalAlign: "middle"
        },
        series: [
          {
            name: "current",
            data: this.state.currentCurve
          },
          {
            name: "1-month ago",
            data: this.state.priorMonthCurve
          }
        ]
      });
    });
  }

  render() {
    return (
      <div className="m-5 px-3">
        <h2>The Yield Curve</h2>
        <section className="row">
          <article className="col-md-8">
            <h4 className="commentary">
              Insights From The Treasuries Yield Curve
            </h4>
            <ul>
              <li>
                The yield curve steepen this week relative a month ago
                indicating continued robustness in the economy and low
                likelihood of a recession in the near term.
              </li>
              <li>
                However, we do see continued increase in yields and
                corresponding lower bond prices as the Fed continuous to raise
                the benchmark interest rate.
              </li>
              <li>
                This increase in yield is expected to have an impact throughout
                the economic as borrowing costs will increase, namely home
                mortgages, car loan, credit cards, etc...
              </li>
            </ul>
            <h4 className="commentary">About the yield curve</h4>
            <p>
              An inverted yield curve where long term interest rates are lower
              than near term interest rates has preceded essentially all
              recessions in recent history.
            </p>
          </article>{" "}
          <div className="col-md-4" id="yieldCurveChart" />
        </section>
      </div>
    );
  }
}

export default YieldCurve;
