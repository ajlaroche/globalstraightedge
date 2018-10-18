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
        <h2>Jobs Report</h2>
        <section className="row">
          <article className="col-md-8">
            <h4 className="commentary">September Employment Highlights</h4>
            <ul>
              <li>
                The unemployment rate declined to 3.7 percent in September to
                its lowest level since 1969, and total nonfarm payroll
                employment increased by 134,000. Job gains occurred in
                professional and business services, in health care, and in
                transportation and warehousing.
              </li>
              <li>
                Incorporating revisions for July and August, which increased
                nonfarm payroll employment by 87,000, monthly job gains have
                averaged 190,000 over the past 3 months.
              </li>
              <li>
                The labor force participation rate held at 62.7 percent in
                September, and the employment-population ratio, at 60.4 percent,
                was little changed.
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
          <div className="col-md-4" id="payrollChart" />
        </section>

        <h2>GDP Report</h2>
        <section className="row">
          <article className="col-md-8">
            <h4 className="commentary">September GDP Highlights</h4>
            <ul>
              <li>
                Real gross domestic product (GDP) increased at an annual rate of
                4.2 percent in the second quarter of 2018, according to the
                "third" estimate released by the Bureau of Economic Analysis. In
                the first quarter, real GDP increased 2.2 percent.
              </li>
              <li>
                Real gross domestic product (GDP) increased at an annual rate of
                4.2 percent in the second quarter of 2018, according to the
                "third" estimate released by the Bureau of Economic Analysis. In
                the first quarter, real GDP increased 2.2 percent.
              </li>
            </ul>
            <h4 className="commentary">About the GDP</h4>
            <p>
              The value of the goods and services produced in the United States
              is the gross domestic product. The percentage that GDP grew (or
              shrank) from one period to another is an important way for
              Americans to gauge how their economy is doing. The United States'
              GDP is also watched around the world as an economic barometer.
            </p>
            <cite>
              U.S. Bureau of Labor Statistics, Real Gross Domestic Product,
              retrieved from
              <a href="http://fred.stlouisfed.org/series/GDPC1"> FRED</a>
              {", "}
              Federal Reserve Bank of St. Louis, October 17, 2018.
            </cite>
          </article>
        </section>
      </div>
    );
  }
}

export default Employment;
