import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import moment from "moment";
import Highcharts from "highcharts";

class Employment extends Component {
  constructor(props) {
    super(props);

    this.getPayrollData = this.getPayrollData.bind(this);

    this.state = {
      payrollDataSet: {},
      learnButton: false
    };
  }

  componentDidMount() {
    this.getPayrollData();
  }

  getPayrollData() {
    API.getPayrolls().then(res => {
      let dataSetCategories = [];
      let dataSetPoints = [];
      res.data.observations.forEach(element => {
        dataSetCategories.push(moment(element.date).format("MM-YY"));
        dataSetPoints.push(parseFloat(element.value));
      });

      this.setState({
        payrollDataSet: {
          categories: dataSetCategories,
          values: dataSetPoints
        }
      });
      Highcharts.chart("payrollChart", {
        chart: {
          type: "column"
          // height: (3 / 4) * 100 + "%" // 3:4 ratio
        },
        legend: { enabled: false },
        title: { text: "Nonfarm Payroll" },
        xAxis: {
          categories: this.state.payrollDataSet.categories.reverse()
        },
        yAxis: {
          title: { text: "change, 1000s of Persons" }
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
            shadow: true
          }
        },
        series: [
          {
            data: this.state.payrollDataSet.values.reverse(),
            color: "#7971ea"
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
              <h2>Jobs Report</h2>
            </div>
            <h4 className="commentary">September Employment Highlights</h4>
            <ul>
              <li>
                Total nonfarm payroll employment edged up in May (+75,000), and
                the unemployment rate remained at 3.6 percent, the U.S. Bureau
                of Labor Statistics reported today. Employment continued to
                trend up in professional and business services and in health
                care.
              </li>
              <li>
                Both the labor force participation rate, at 62.8 percent, and
                the employment-population ratio, at 60.6 percent, were unchanged
                in May.
              </li>
              <li>
                In May, the number of persons unemployed less than 5 weeks
                increased by 243,000 to 2.1 million, following a decline in
                April. The number of long-term unemployed (those jobless for 27
                weeks or more), at 1.3 million, changed little over the month
                and accounted for 22.4 percent of the unemployed.
              </li>
            </ul>

            <a
              className="btn btn-link commentary"
              data-toggle="collapse"
              href="#collapseEmployment"
              role="button"
              aria-expanded="false"
              aria-controls="collapseEmployment"
              onClick={() =>
                this.setState({ learnButton: !this.state.learnButton })
              }
            >
              Learn more about the unemployment rate{"   "}
              <i
                className={
                  this.state.learnButton
                    ? "fas fa-angle-double-down"
                    : "fas fa-angle-double-right"
                }
              />
            </a>

            <div className="collapse" id="collapseEmployment">
              <div className="card card-body">
                <p>
                  The unemployment rate represents the number of unemployed as a
                  percentage of the labor force. Labor force data are restricted
                  to people 16 years of age and older, who currently reside in 1
                  of the 50 states or the District of Columbia, who do not
                  reside in institutions (e.g., penal and mental facilities,
                  homes for the aged), and who are not on active duty in the
                  Armed Forces.
                </p>
                <cite>
                  U.S. Bureau of Labor Statistics, Civilian Unemployment Rate,
                  retrieved from
                  <a href="http://fred.stlouisfed.org/series/UNRATE"> FRED</a>
                  {", "}
                  Federal Reserve Bank of St. Louis, October 13, 2018.
                </cite>
              </div>
            </div>
          </article>{" "}
          <div
            className="col-lg-4 chartData"
            id="payrollChart"
            // style={{ height: "400px" }}
          />
        </section>
      </div>
    );
  }
}

export default Employment;
