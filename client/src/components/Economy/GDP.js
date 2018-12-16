import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import moment from "moment";
import Highcharts from "highcharts";

class GDP extends Component {
  constructor(props) {
    super(props);

    this.getConsumptionData = this.getConsumptionData.bind(this);
    this.plotData = this.plotData.bind(this);

    this.state = {
      consumptionDataSet: {},
      recessionDataSet: {},
      plotShades: [],
      learnButton: false
    };
  }

  componentDidMount() {
    this.getConsumptionData();
  }

  getConsumptionData() {
    API.getConsumption().then(res => {
      let dataSetCategories = [];
      let dataSetPoints = [];
      res.data.observations.forEach(element => {
        dataSetCategories.push(moment(element.date).format("MM-YY"));
        dataSetPoints.push(parseFloat(element.value));
      });

      this.setState({
        consumptionDataSet: {
          categories: dataSetCategories.reverse(),
          values: dataSetPoints.reverse()
        }
      });
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

        this.plotData();
      });
    });
  }

  plotData() {
    Highcharts.chart("consumptionChart", {
      legend: { enabled: false },
      title: { text: "Personal consumption Expenditures" },

      // chart: {
      //   height: (3 / 4) * 100 + "%" // 3:4 ratio
      // },
      xAxis: {
        minPadding: 0.05,
        maxPadding: 0.05,
        categories: this.state.consumptionDataSet.categories,
        tickmarkPlacement: "on",
        plotBands: this.state.plotShades
      },
      yAxis: [
        {
          title: { text: "change from year ago, Billions" },
          gridLineWidth: 0
        },
        {
          visible: false,
          max: 1.0,
          alignTicks: false,
          title: { text: undefined },
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
      series: [
        {
          yAxis: 0,
          data: this.state.consumptionDataSet.values
        }
      ]
    });
  }

  render() {
    return (
      <div className="m-5 px-3">
        <section className="row">
          <article className="col-md-8 my-auto">
            <div className="row">
              <h2>GDP Report</h2>
            </div>
            <h4 className="commentary">September GDP Highlights</h4>
            <ul>
              <li>
                Real gross domestic product (GDP) increased at an annual rate of
                3.5 percent in the third quarter of 2018 (table 1), according to
                the "advance" estimate released by the Bureau of Economic
                Analysis. In the second quarter, real GDP increased 4.2 percent.
              </li>
              <li>
                The increase in real GDP in the third quarter reflected positive
                contributions from personal consumption expenditures (PCE),
                private inventory investment, state and local government
                spending, federal government spending, and nonresidential fixed
                investment that were partly offset by negative contributions
                from exports and residential fixed investment. Imports, which
                are a subtraction in the calculation of GDP, increased (table
                2).
              </li>
              <li>
                The deceleration in real GDP growth in the third quarter
                reflected a downturn in exports and a deceleration in
                nonresidential fixed investment. Imports increased in the third
                quarter after decreasing in the second. These movements were
                partly offset by an upturn in private inventory investment.
              </li>
            </ul>

            <a
              className="btn btn-link commentary"
              data-toggle="collapse"
              href="#collapseGDP"
              role="button"
              aria-expanded="false"
              aria-controls="collapseGDP"
              onClick={() =>
                this.setState({ learnButton: !this.state.learnButton })
              }
            >
              Learn more about the Gross Domestic Product{"   "}
              <i
                className={
                  this.state.learnButton
                    ? "fas fa-angle-double-down"
                    : "fas fa-angle-double-right"
                }
              />
            </a>
            <div className="collapse" id="collapseGDP">
              <div className="card card-body">
                <p>
                  The value of the goods and services produced in the United
                  States is the gross domestic product. The percentage that GDP
                  grew (or shrank) from one period to another is an important
                  way for Americans to gauge how their economy is doing. The
                  United States' GDP is also watched around the world as an
                  economic barometer.
                </p>
                <cite>
                  U.S. Bureau of Labor Statistics, Real Gross Domestic Product,
                  retrieved from
                  <a href="http://fred.stlouisfed.org/series/GDPC1"> FRED</a>
                  {", "}
                  Federal Reserve Bank of St. Louis, October 17, 2018.
                </cite>
              </div>
            </div>
          </article>
          <div
            className="col-md-4 my-auto"
            id="consumptionChart"
            style={{ height: "400px" }}
          />
        </section>
      </div>
    );
  }
}

export default GDP;
