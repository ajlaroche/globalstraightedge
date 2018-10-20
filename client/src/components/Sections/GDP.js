import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import moment from "moment";
import Highcharts from "highcharts";

class GDP extends Component {
  constructor(props) {
    super(props);

    this.getConsumptionData = this.getConsumptionData.bind(this);
    this.recessionData = this.getRecessionData.bind(this);
    this.plotData = this.plotData.bind(this);

    this.state = {
      consumptionDataSet: {},
      recessionData: {}
    };
  }

  componentDidMount() {
    this.getConsumptionData();
    // this.recessionData();
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
          categories: dataSetCategories,
          values: dataSetPoints
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
            categories: dataSetCategories,
            values: dataSetPoints
          }
        });
        console.log(this.state.recessionDataSet);
        this.plotData();
      });
      console.log(this.state.consumptionDataSet);
    });
  }

  getRecessionData() {
    API.getRecessions().then(res => {
      let dataSetCategories = [];
      let dataSetPoints = [];
      res.data.observations.forEach(element => {
        dataSetCategories.push(moment(element.date).format("MM-YY"));
        dataSetPoints.push(parseFloat(element.value));
      });

      this.setState({
        recessionDataSet: {
          categories: dataSetCategories,
          values: dataSetPoints
        }
      });
      console.log(this.state.recessionDataSet);
    });
  }

  plotData() {
    Highcharts.chart("consumptionChart", {
      legend: { enabled: false },
      title: { text: "Personal consumption Expenditures" },
      xAxis: {
        minPadding: 0.05,
        maxPadding: 0.05,
        categories: this.state.consumptionDataSet.categories.reverse(),
        tickmarkPlacement: "on"
      },
      yAxis: [
        {
          title: { text: "change from year ago, Billions" }
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
          data: this.state.consumptionDataSet.values.reverse()
        },
        {
          type: "area",
          marker: { enabled: false },
          yAxis: 1,
          data: this.state.recessionDataSet.values.reverse(),
          color: "#cac9c6",
          fillOpacity: 0.5
        }
      ]
    });
  }

  render() {
    return (
      <div className="m-5 px-3">
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
          <div className="col-md-4" id="consumptionChart" />
        </section>
      </div>
    );
  }
}

export default GDP;
