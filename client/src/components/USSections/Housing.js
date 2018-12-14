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
      housePriceDataSet: {},
      housingStartsDataSet: {},
      plotShades: []
    };
  }

  componentDidMount() {
    this.getHousingData();
  }

  getHousingData() {
    API.getHousePrice().then(res => {
      // console.log(res.data);
      let dataSetCategories = [];
      let dataSetPoints = [];
      res.data.observations.forEach(element => {
        dataSetCategories.push(moment(element.date).format("MM-YY"));
        dataSetPoints.push(parseFloat(element.value));
      });
      this.setState({
        housePriceDataSet: {
          categories: dataSetCategories.reverse(),
          values: dataSetPoints.reverse()
        }
      });

      API.getHousingStarts().then(resStarts => {
        // console.log(resStarts.data);
        let startsDataSetCategories = [];
        let startsDataSetPoints = [];
        resStarts.data.observations.forEach(element => {
          startsDataSetCategories.push(moment(element.date).format("MM-YY"));
          startsDataSetPoints.push(parseFloat(element.value));
        });
        this.setState({
          housingStartsDataSet: {
            categories: startsDataSetCategories.reverse(),
            values: startsDataSetPoints.reverse()
          }
        });
        console.log(this.state.housingStartsDataSet);

        API.getRecessions().then(res => {
          let dataSetCategories = [];
          let dataSetPoints = [];
          res.data.observations.forEach(element => {
            dataSetCategories.push(moment(element.date).format("MM-YY"));
            dataSetPoints.push(parseFloat(element.value));
          });

          this.setState({
            recessionDataSet: {
              categories: dataSetCategories.reverse(),
              values: dataSetPoints.reverse()
            }
          });

          // generate objects based on recession data to create plot bands
          let shadeFrom = 0;
          let shadeTo = 0;

          let shadeInstances = {};

          const shades = [];

          // Find points were predecessor and successor don't match and record to plot band object
          for (let i = 0; i < dataSetPoints.length; i++) {
            if (i > 0 && dataSetPoints[i] === 1 && dataSetPoints[i - 1] === 0) {
              shadeFrom = i;
            } else if (
              i > 0 &&
              dataSetPoints[i] === 0 &&
              dataSetPoints[i - 1] === 1
            ) {
              shadeTo = i;
              shadeInstances = {
                color: "rgba(68, 170, 213, .2)",
                from: shadeFrom,
                to: shadeTo
              };

              shades.push(shadeInstances);
              shadeFrom = 0;
              shadeTo = 0;
              shadeInstances = {};
            }
          }

          this.setState({
            plotShades: shades
          });

          console.log(this.state.plotShades);

          Highcharts.chart("housePriceChart", {
            // chart: {
            //   height: (3 / 4) * 100 + "%" // 3:4 ratio
            // },
            // legend: { enabled: false },
            title: { text: "Home Price Index" },
            xAxis: {
              categories: this.state.housePriceDataSet.categories,
              plotBands: this.state.plotShades
            },
            yAxis: [
              {
                title: { text: "Price Index % change from a year ago" }
              },
              {
                title: { text: "Thousands of Units" },
                opposite: true
              }
            ],
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
                yAxis: 0,
                name: "Price Index",
                data: this.state.housePriceDataSet.values,
                color: "#7971ea"
              },
              {
                yAxis: 1,
                name: "Housing Starts",
                data: this.state.housingStartsDataSet.values
              }
            ]
          });
        });
      });
    });
  }

  render() {
    return (
      <div className="m-5 px-3">
        <section className="row">
          <article className="col-lg-8 my-auto">
            <div className="row">
              <h2>Housing Report</h2>
            </div>
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
          <div
            className="col-lg-4"
            id="housePriceChart"
            style={{ height: "400px" }}
          />
        </section>
      </div>
    );
  }
}

export default Housing;
