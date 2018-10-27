import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import moment from "moment";
import Highcharts from "highcharts";

class Housing extends Component {
  constructor(props) {
    super(props);

    this.getHousingData = this.getHousingData.bind(this);
    this.state = {
      housePriceDataSet: {}
    };
  }

  componentDidMount() {
    this.getHousingData();
  }

  getHousingData() {
    API.getHousePrice().then(res => {
      console.log(res.data);
      let dataSetCategories = [];
      let dataSetPoints = [];
      res.data.observations.forEach(element => {
        dataSetCategories.push(moment(element.date).format("MM-YY"));
        dataSetPoints.push(parseFloat(element.value));
      });
      this.setState({
        housePriceDataSet: {
          categories: dataSetCategories,
          values: dataSetPoints
        }
      });
      Highcharts.chart("housePriceChart", {
        chart: {
          // height: (3 / 4 * 100) + '%' // 3:4 ratio
        },
        legend: { enabled: false },
        title: { text: "Home Price Index" },
        xAxis: {
          categories: this.state.housePriceDataSet.categories.reverse()
        },
        yAxis: {
          title: { text: "% change from a year ago" }
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
            data: this.state.housePriceDataSet.values.reverse(),
            color: "#7971ea"
          }
        ]
      });
    });
  }

  render() {
    return (
      <div className="m-5 px-3">
        <h2>Housing Report</h2>
        <section className="row">
          <article className="col-md-8">
            <h4 className="commentary">September Housing Highlights</h4>
            <ul>
              <li>
                Housing starts have start to slow down over the last few months
                with increasing mortgage rates and rising prices starting to
                take a toll on demand.
              </li>
              <li>
                Nationwide prices continue to rise at a healthy 6-7% clip, but
                starting to show signs of moderating.
              </li>
            </ul>
            <div className="row">
              <h4 className="commentary">About the House Price Index</h4>
              <p>
                The FHFA House Price Index (HPI) is a broad measure of the
                movement of single-family house prices. The HPI is a weighted,
                repeat-sales index, meaning that it measures average price
                changes in repeat sales or refinancings on the same properties.
                This information is obtained by reviewing repeat mortgage
                transactions on single-family properties whose mortgages have
                been purchased or securitized by Fannie Mae or Freddie Mac since
                January 1975.
              </p>
              <cite>
                U.S. Bureau of Labor Statistics, Civilian Unemployment Rate,
                retrieved from
                <a href="http://fred.stlouisfed.org/series/UNRATE"> FRED</a>
                {", "}
                Federal Reserve Bank of St. Louis, October 13, 2018.
              </cite>
            </div>
          </article>{" "}
          <div className="col-md-4" id="housePriceChart" />
        </section>
      </div>
    );
  }
}

export default Housing;
