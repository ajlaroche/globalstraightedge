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
      payrollDataSet: {}
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
          <article className="col-md-8 my-auto">
            <div className="row">
              <h2>Jobs Report</h2>
            </div>
            <h4 className="commentary">September Employment Highlights</h4>
            <ul>
              <li>
                Total nonfarm payroll employment rose by 250,000 in October, and
                the unemployment rate was unchanged at 3.7 percent, the U.S.
                Bureau of Labor Statistics reported today. Job gains occurred in
                health care, in manufacturing, in construction, and in
                transportation and warehousing.
              </li>
              <li>
                Among the major worker groups, the unemployment rates for adult
                men (3.5 percent), adult women (3.4 percent), teenagers (11.9
                percent), Whites (3.3 percent), Blacks (6.2 percent), Asians
                (3.2 percent), and Hispanics (4.4 percent) showed little or no
                change in October.
              </li>
              <li>
                The number of long-term unemployed (those jobless for 27 weeks
                or more) was essentially unchanged at 1.4 million in October and
                accounted for 22.5 percent of the unemployed.
              </li>
            </ul>

            <h4 className="commentary">About the unemployment rate</h4>
            <p>
              The unemployment rate represents the number of unemployed as a
              percentage of the labor force. Labor force data are restricted to
              people 16 years of age and older, who currently reside in 1 of the
              50 states or the District of Columbia, who do not reside in
              institutions (e.g., penal and mental facilities, homes for the
              aged), and who are not on active duty in the Armed Forces.
            </p>
            <cite>
              U.S. Bureau of Labor Statistics, Civilian Unemployment Rate,
              retrieved from
              <a href="http://fred.stlouisfed.org/series/UNRATE"> FRED</a>
              {", "}
              Federal Reserve Bank of St. Louis, October 13, 2018.
            </cite>
          </article>{" "}
          <div className="col-md-4" id="payrollChart" style={{ height: 400 }} />
        </section>
      </div>
    );
  }
}

export default Employment;
