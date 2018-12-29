import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import moment from "moment-timezone";
import Highcharts from "highcharts";
import Slider from "react-rangeslider";
import PortfolioAnalytics from "portfolio-analytics";
// To include the default styles
import "react-rangeslider/lib/index.css";

class GlobalPortfolio extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleGlobalChange = this.handleGlobalChange.bind(this);
    this.handleDevelopedChange = this.handleDevelopedChange.bind(this);
    this.handleBondChange = this.handleBondChange.bind(this);
    this.updatePortfolio = this.updatePortfolio.bind(this);
    this.analyzePortfolio = this.analyzePortfolio.bind(this);

    this.state = {
      globalValue: 50,
      developedValue: 50,
      bondValue: 50,
      SandPHoldings: 50,
      developedStocksHoldings: 50,
      emergingStocksHoldings: 50,
      emergingBondHoldings: 50,
      developedBondHoldings: 50,
      targetStockIndex: 0,
      baselineStockIndex: 0,
      riskFreeIndex: 0,
      baselineSharpeRatio: 0,
      targetStockShapeRatio: 0,
      weightedReturn: 0,
      tickers: [
        { ticker: "VEA", name: "Developed Markets" },
        { ticker: "SPY", name: "S&P 500" },
        { ticker: "UUP", name: "U.S. Dollar Index" },
        { ticker: "BNDX", name: "International Bond" },
        { ticker: "VWOB", name: "Emerging Bonds" },
        { ticker: "IEMG", name: "Emerging Stocks" },
        { ticker: "SHV", name: "Short Term Treasuries" }
      ],
      interval: "5y",
      priceView: "price",
      axisTitle: "$ per Share",
      axisUnits: "",
      returnedData: [],
      legendShow: false,
      addBenchmark: false,
      benchmarkTicker: "SPY",
      benchmarkIndex: 0,
      primaryStock: {},
      benchmarkData: {},
      plotSeries: [],
      portfolioWeightedQuotes: [],
      dayOfWeek: 0
    };
  }

  componentDidMount() {
    this.getGlobalQuotes(this.state.interval, this.state.priceView);
    this.updatePortfolio();
    // this.analyzePortfolio();
  }

  updatePortfolio() {
    let weightPortfolioPrice = [];

    if (this.state.returnedData.length > 0) {
      for (let i = 0; i < this.state.returnedData[0].yAxis.length; i++) {
        weightPortfolioPrice[i] = 0;
      }
    }

    this.setState({
      weightedReturn: 0,
      SandPHoldings: 100 - this.state.globalValue,
      developedStocksHoldings:
        (((((this.state.globalValue / 100) * this.state.developedValue) / 100) *
          this.state.bondValue) /
          100) *
        100,
      developedBondHoldings:
        (((((this.state.globalValue / 100) * this.state.developedValue) / 100) *
          (100 - this.state.bondValue)) /
          100) *
        100,
      emergingStocksHoldings:
        (((((this.state.globalValue / 100) *
          (100 - this.state.developedValue)) /
          100) *
          this.state.bondValue) /
          100) *
        100,
      emergingBondHoldings:
        (((((this.state.globalValue / 100) *
          (100 - this.state.developedValue)) /
          100) *
          (100 - this.state.bondValue)) /
          100) *
        100
    });
    for (let i = 0; i < this.state.returnedData.length; i++) {
      switch (this.state.returnedData[i].ticker) {
        case "SPY":
          this.setState({
            weightedReturn:
              this.state.weightedReturn +
              (this.state.SandPHoldings / 100) *
                this.state.returnedData[i].annualizedReturn
          });
          break;
        case "VEA":
          this.setState({
            weightedReturn:
              this.state.weightedReturn +
              (this.state.developedStocksHoldings / 100) *
                this.state.returnedData[i].annualizedReturn
          });
          break;
        case "BNDX":
          this.setState({
            weightedReturn:
              this.state.weightedReturn +
              (this.state.developedBondHoldings / 100) *
                this.state.returnedData[i].annualizedReturn
          });
          break;
        case "IEMG":
          this.setState({
            weightedReturn:
              this.state.weightedReturn +
              (this.state.emergingStocksHoldings / 100) *
                this.state.returnedData[i].annualizedReturn
          });
          break;
        case "VWOB":
          this.setState({
            weightedReturn:
              this.state.weightedReturn +
              (this.state.emergingBondHoldings / 100) *
                this.state.returnedData[i].annualizedReturn
          });
          break;
      }
    }

    this.state.returnedData.forEach(element => {
      let weight = 0;
      switch (element.ticker) {
        case "SPY":
          weight = this.state.SandPHoldings / 100;
          for (let i = 0; i < element.yAxis.length; i++) {
            weightPortfolioPrice[i] += weight * element.yAxis[i];
          }
          break;
        case "VEA":
          weight = this.state.developedStocksHoldings / 100;
          for (let i = 0; i < element.yAxis.length; i++) {
            weightPortfolioPrice[i] += weight * element.yAxis[i];
          }
          break;
        case "BNDX":
          weight = this.state.developedBondHoldings / 100;
          for (let i = 0; i < element.yAxis.length; i++) {
            weightPortfolioPrice[i] += weight * element.yAxis[i];
          }
          break;
        case "IEMG":
          weight = this.state.emergingStocksHoldings / 100;
          for (let i = 0; i < element.yAxis.length; i++) {
            weightPortfolioPrice[i] += weight * element.yAxis[i];
          }
          break;
        case "VWOB":
          weight = this.state.emergingBondHoldings / 100;
          for (let i = 0; i < element.yAxis.length; i++) {
            weightPortfolioPrice[i] += weight * element.yAxis[i];
          }
          break;
        default:
          weight = 0;
      }
      // console.log(weightPortfolioPrice);
    });

    this.setState({ portfolioWeightedQuotes: weightPortfolioPrice });
    // console.log(this.state.portfolioWeightedQuotes);
  }

  handleGlobalChange(value) {
    this.setState({ globalValue: value });
    this.updatePortfolio();
    this.analyzePortfolio();
  }

  handleDevelopedChange(value) {
    this.setState({
      developedValue: value
    });
    this.updatePortfolio();
    this.analyzePortfolio();
  }

  handleBondChange(value) {
    this.setState({ bondValue: value });
    this.updatePortfolio();
    this.analyzePortfolio();
  }

  updateQuotes(userInterval, dataType) {
    console.log(userInterval);
    const today = new Date();
    const marketOpen = moment("09:00:00", "HH:mm:ss");
    const marketClose = moment("16:30:00", "HH:mm:ss");
    const marketTime = moment()
      .tz("America/New_York")
      .isBetween(marketOpen, marketClose);
    console.log(marketTime);

    // Need to correct if falls on weekend or outside market hours
    if (
      userInterval === "1d" &&
      (today.getDay() === 0 || today.getDay() === 6)
    ) {
      userInterval = "1m";
      this.setState({
        interval: userInterval
      });
      this.getGlobalQuotes(userInterval, dataType);
    } else {
      this.setState({
        interval: userInterval
      });
      this.getGlobalQuotes(userInterval, dataType);
    }
  }

  analyzePortfolio() {
    this.setState({
      targetStockShapeRatio: PortfolioAnalytics.sharpeRatio(
        this.state.portfolioWeightedQuotes,
        this.state.returnedData[this.state.riskFreeIndex].yAxis
      ),
      baselineSharpeRatio: PortfolioAnalytics.sharpeRatio(
        this.state.returnedData[this.state.baselineStockIndex].yAxis,
        this.state.returnedData[this.state.riskFreeIndex].yAxis
      )
    });
  }

  getGlobalQuotes(userInterval, dataType) {
    this.setState({
      returnedData: [],
      savedReturns: [],
      interval: userInterval,
      priceView: dataType
    });

    // Adjust x axis depending on user selected time interval
    let changeAxis = 1;
    let numberDays = 30;

    switch (userInterval) {
      case "1d":
        changeAxis = 20;
        numberDays = 1;
        break;
      case "1m":
        changeAxis = 1;
        numberDays = 30;
        break;
      case "6m":
        changeAxis = 1;
        numberDays = 180;
        break;
      case "1y":
        changeAxis = 10;
        numberDays = 365;
        break;
      case "2y":
        changeAxis = 60;
        numberDays = 730;
        break;
      case "5y":
        changeAxis = 60;
        numberDays = 1825;
        break;
      default:
        changeAxis = 1;
        numberDays = 30;
    }

    let tempValues = [];

    this.state.tickers.forEach(element => {
      API.getGlobalIndex({ ticker: element.ticker, interval: userInterval })
        .then(res => {
          let categories = [];
          let values = [];
          let indexData = {};
          let timeScale = "";
          let dataPoint = 0;
          let lastPrice = res.data[res.data.length - 1].close;
          let returntoDate = res.data[res.data.length - 1].changeOverTime * 100;
          this.setState({ weightedReturn: 0 });

          // Adjust return to date key if user selects 1 day interval since API object is different for minute data
          if (userInterval === "1d") {
            for (let i = 1; i < res.data.length; i++) {
              returntoDate =
                res.data[res.data.length - i].marketChangeOverTime * 100;
              lastPrice = res.data[res.data.length - i].marketClose;
              console.log(lastPrice);
              if (lastPrice) break;
            }
          } else {
            returntoDate = res.data[res.data.length - 1].changeOverTime * 100;
            lastPrice = res.data[res.data.length - 1].close;
          }

          // console.log(res.data);
          res.data.forEach(point => {
            if (userInterval === "1d") {
              timeScale = point.minute;
              if (dataType === "price") {
                dataPoint = point.marketClose;
              } else {
                dataPoint = point.marketChangeOverTime * 100;
              }
            } else {
              timeScale = point.date;
              if (dataType === "price") {
                dataPoint = point.close;
              } else {
                dataPoint = point.changeOverTime * 100;
              }
            }
            // Check if datapoint is valid before pushing to prevent graph scaling issues.
            // This mostly affects the daily graph option
            if (
              dataPoint &&
              !(
                userInterval === "1d" &&
                dataType === "change" &&
                dataPoint < -99
              ) &&
              !(
                userInterval === "1d" &&
                dataType === "change" &&
                dataPoint > 99
              ) &&
              !(
                userInterval === "1d" &&
                dataType === "price" &&
                dataPoint === 0
              )
            ) {
              categories.push(timeScale);
              values.push(dataPoint);
            }
          });

          indexData = {
            ticker: element.ticker,
            name: element.name,
            currentPrice: lastPrice,
            returnPercent: returntoDate.toFixed(2),
            annualizedReturn:
              (Math.pow(1 + returntoDate / 100, 365 / numberDays) - 1) * 100,
            xAxis: categories,
            yAxis: values,
            xLastPoint: categories.length - 1, // Use to place annotation
            yLastPoint: values[values.length - 1] // Use to place annotation
          };

          tempValues.push(indexData);

          this.setState({
            returnedData: tempValues
          });

          this.setState({
            // targetStockIndex: this.state.returnedData.findIndex(element => {
            //   return element.ticker === "IEMG";
            // }),
            baselineStockIndex: this.state.returnedData.findIndex(element => {
              return element.ticker === "SPY";
            }),
            riskFreeIndex: this.state.returnedData.findIndex(element => {
              return element.ticker === "SHV";
            })
          });

          console.log(indexData);
          this.updatePortfolio();

          if (
            this.state.baselineStockIndex !== -1 &&
            this.state.riskFreeIndex !== -1 &&
            this.state.portfolioWeightedQuotes.length > 0
          ) {
            this.analyzePortfolio();
          }

          console.log(this.state.returnedData);
        })
        .catch(err => console.log(err));
    });
  }

  render() {
    return (
      <div className="m-5 px-3">
        <h2>Build Your Global Portfolio</h2>
        <section className="row">
          <div className="col-md-4 portfolioSection">
            <div className="row">
              <div className="col-md-4">
                <p className="sliderHeader">Global {this.state.globalValue}%</p>
              </div>
              <div className="col-md-4">
                <p className="sliderHeader">
                  Developed {this.state.developedValue}%
                </p>
              </div>
              <div className="col-md-4">
                <p className="sliderHeader">Stocks {this.state.bondValue}%</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 sliderCol">
                <div className="slider orientation-reversed mx-auto">
                  <div className="slider-group">
                    <div className="slider-vertical">
                      <Slider
                        min={0}
                        max={100}
                        value={this.state.globalValue}
                        orientation="vertical"
                        onChange={this.handleGlobalChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 sliderCol">
                <div className="slider orientation-reversed mx-auto">
                  <div className="slider-group">
                    <div className="slider-vertical">
                      <Slider
                        min={0}
                        max={100}
                        value={this.state.developedValue}
                        orientation="vertical"
                        onChange={this.handleDevelopedChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 sliderCol">
                <div className="slider orientation-reversed mx-auto">
                  <div className="slider-group">
                    <div className="slider-vertical">
                      <Slider
                        min={0}
                        max={100}
                        value={this.state.bondValue}
                        orientation="vertical"
                        onChange={this.handleBondChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <p className="sliderHeader">
                  Domestic {100 - this.state.globalValue}%
                </p>
              </div>
              <div className="col-md-4">
                <p className="sliderHeader">
                  Emerging {100 - this.state.developedValue}%
                </p>
              </div>
              <div className="col-md-4">
                <p className="sliderHeader">
                  Bonds {100 - this.state.bondValue}%
                </p>
              </div>
            </div>
          </div>
          {/* Start Portfolio breakdown table here */}
          <div className="col-md-4 portfolioSection">
            <div className="row justify-content-center">
              <p className="sliderHeader">Recommended Portfolio</p>
            </div>
            <div className="row">
              {/* First column in portfolio table */}
              <div className="col-md-5 portfolioTable">
                <div className="row tableSpacer" />
                <div className="row portfolioRow">
                  {" "}
                  <p className="portfolioItem">S&P 500 (SPY)</p>
                </div>
                <div className="row portfolioRow">
                  <p className="portfolioItem">Developed Stocks (VEA)</p>
                </div>
                <div className="row portfolioRow">
                  <p className="portfolioItem">Developed Bonds (BNDX)</p>
                </div>
                <div className="row portfolioRow">
                  <p className="portfolioItem">Emerging Stocks (IEMG)</p>
                </div>
                <div className="row portfolioRow">
                  <p className="portfolioItem">Emerging Bonds (VWOB)</p>
                </div>
              </div>
              {/* Second column in portfolio table */}
              <div className="col-md-1 portfolioTable">
                <div className="row tableSpacer" />
                <div className="row portfolioRow">
                  {" "}
                  <p className="portfolioItem">
                    {this.state.SandPHoldings.toFixed(2)}%
                  </p>
                </div>
                <div className="row portfolioRow">
                  <p className="portfolioItem">
                    {this.state.developedStocksHoldings.toFixed(2)}%
                  </p>
                </div>
                <div className="row portfolioRow">
                  <p className="portfolioItem">
                    {this.state.developedBondHoldings.toFixed(2)}%
                  </p>
                </div>
                <div className="row portfolioRow">
                  <p className="portfolioItem">
                    {this.state.emergingStocksHoldings.toFixed(2)}%
                  </p>
                </div>
                <div className="row portfolioRow">
                  <p className="portfolioItem">
                    {this.state.emergingBondHoldings.toFixed(2)}%
                  </p>
                </div>
              </div>
              {/* Start third Column in portfolio table here */}
              <div className="col-md-6 portfolioTable">
                <div className="row periodButtons">
                  <p>
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => {
                        this.updateQuotes("6m", this.state.priceView);
                        this.updatePortfolio();
                        this.analyzePortfolio();
                      }}
                      disabled={this.state.interval === "6m" ? true : false}
                    >
                      6 Mo
                    </button>
                    |
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => {
                        this.updateQuotes("1y", this.state.priceView);
                        this.updatePortfolio();
                        this.analyzePortfolio();
                      }}
                      disabled={this.state.interval === "1y" ? true : false}
                    >
                      1 yr
                    </button>{" "}
                    |{" "}
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => {
                        this.updateQuotes("2y", this.state.priceView);
                        this.updatePortfolio();
                        this.analyzePortfolio();
                      }}
                      disabled={this.state.interval === "2y" ? true : false}
                    >
                      2 Yr
                    </button>{" "}
                    |{" "}
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => {
                        this.updateQuotes("5y", this.state.priceView);
                        this.updatePortfolio();
                        this.analyzePortfolio();
                      }}
                      disabled={this.state.interval === "5y" ? true : false}
                    >
                      5 Yr
                    </button>
                  </p>
                </div>
                <div className="row justify-content-center">
                  <p className="weightedReturn">
                    {this.state.weightedReturn.toFixed(1)}%
                  </p>
                </div>
                <div className="row justify-content-center">Sharpe Ratio</div>
                <div className="row justify-content-center">
                  S&P 500: {this.state.baselineSharpeRatio.toFixed(3)}
                </div>
                <div className="row justify-content-center">
                  Portfolio: {this.state.targetStockShapeRatio.toFixed(3)}
                </div>
              </div>
            </div>
          </div>

          {/* Start Chart Here */}

          <div
            className="col-md-4"
            id="portfolioChart"
            style={{ height: "200px" }}
          />
        </section>
      </div>
    );
  }
}

export default GlobalPortfolio;
