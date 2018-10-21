import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import moment from "moment";
import Highcharts from "highcharts";

class YieldCurve extends Component {
  constructor(props) {
    super(props);

    this.getYieldCurve = this.getYieldCurve.bind(this);
  }

  componentDidMount() {
    this.getYieldCurve();
  }

  getYieldCurve() {
    API.getYieldCurve().then(res => {
      console.log(res.data);
    });
  }

  render() {
    return (
      <div className="m-5 px-3">
        <h2>The Yield Curve</h2>
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
      </div>
    );
  }
}

export default YieldCurve;
