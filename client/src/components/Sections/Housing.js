import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import moment from "moment";
import Highcharts from "highcharts";

class Housing extends Component {
  render() {
    return (
      <div className="m-5 px-3">
        <h2>Housing Report</h2>
        <section className="row">
          <article className="col-md-8">
            <h4 className="commentary">September Housing Highlights</h4>
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
              The FHFA House Price Index (HPI) is a broad measure of the
              movement of single-family house prices. The HPI is a weighted,
              repeat-sales index, meaning that it measures average price changes
              in repeat sales or refinancings on the same properties. This
              information is obtained by reviewing repeat mortgage transactions
              on single-family properties whose mortgages have been purchased or
              securitized by Fannie Mae or Freddie Mac since January 1975.
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

export default Housing;
