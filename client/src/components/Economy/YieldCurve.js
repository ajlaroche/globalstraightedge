import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
// import moment from "moment";
import Highcharts from "highcharts";

class YieldCurve extends Component {
  constructor(props) {
    super(props);

    this.getYieldCurve = this.getYieldCurve.bind(this);

    this.state = {
      currentCurve: [],
      priorMonthCurve: [],
      learnButton: false
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
        curveData.fiveYear[0],
        curveData.tenYear[0],
        curveData.thirtyYear[0]
      );

      prior.push(
        curveData.threeMonth[1],
        curveData.twoYear[1],
        curveData.fiveYear[1],
        curveData.tenYear[1],
        curveData.thirtyYear[1]
      );
      // console.log(current);
      // console.log(prior);

      this.setState({
        currentCurve: current,
        priorMonthCurve: prior
      });

      const terms = ["3-month", "2-year", "5-year", "10-year", "30-year"];

      Highcharts.chart("yieldCurveChart", {
        title: { text: "The Yield Curve" },
        chart: {
          // height: (9 / 16) * 100 + "%" // 3:4 ratio
        },
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
          align: "center",
          verticalAlign: "bottom",
          x: 0,
          y: 0
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
        <section className="row">
          <article className="col-lg-8 my-auto">
            <div className="row">
              <h2>The Yield Curve</h2>
            </div>
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
            <a
              className="btn btn-link commentary"
              data-toggle="collapse"
              href="#collapseYieldCurve"
              role="button"
              aria-expanded="false"
              aria-controls="collapseYieldCurve"
              onClick={() =>
                this.setState({ learnButton: !this.state.learnButton })
              }
            >
              Learn more about the yield curve{"   "}
              <i
                className={
                  this.state.learnButton
                    ? "fas fa-angle-double-down"
                    : "fas fa-angle-double-right"
                }
              />
            </a>
            <div className="collapse" id="collapseYieldCurve">
              <div className="card card-body">
                <p>
                  An inverted yield curve where long term interest rates are
                  lower than near term interest rates has preceded essentially
                  all recessions in recent history.
                </p>
              </div>
            </div>
          </article>{" "}
          <div
            className="col-lg-4 chartData"
            id="yieldCurveChart"
            // style={{ height: "400px" }}
          />
        </section>
      </div>
    );
  }
}

export default YieldCurve;
