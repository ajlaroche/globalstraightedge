import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import moment from "moment-timezone";
import Highcharts from "highcharts";
import Slider from "react-rangeslider";
import PortfolioAnalytics from "portfolio-analytics";
// To include the default styles
import "react-rangeslider/lib/index.css";

class USPortfolio extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleBondChange = this.handleBondChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleLargeCapChange = this.handleLargeCapChange.bind(this);
    this.handleMidCapChange = this.handleMidCapChange.bind(this);
    this.handleCorporateChange = this.handleCorporateChange.bind(this);
    this.handleMuniChange = this.handleMuniChange.bind(this);
    this.handleHighYieldChange = this.handleHighYieldChange.bind(this);
    this.updatePortfolio = this.updatePortfolio.bind(this);
    this.analyzePortfolio = this.analyzePortfolio.bind(this);
    this.plotData = this.plotData.bind(this);

    this.state = {
      bondValue: 50,
      valueStockValue: 50,
      largeValue: 50,
      midValue: 50,
      corporateValue: 50,
      muniValue: 50,
      highYieldValue: 50,
      stockHoldings: 50,
      bondHoldings: 50,
      SandPHoldings: 50,
      valueHoldings: 50,
      midSmallCapHoldings: 50,
      largeCapHoldings: 50,
      midCapHoldings: 50,
      smallCapHoldings: 50,
      corporateHoldings: 50,
      governmentHoldings: 50,
      muniHoldings: 50,
      tipsHoldings: 50,
      highYieldHoldings: 50,
      highQualityHoldings: 50,
      targetStockIndex: 0,
      baselineStockIndex: 0,
      riskFreeIndex: 0,
      baselineSharpeRatio: 0,
      targetStockShapeRatio: 0,
      weightedReturn: 0,
      tickers: [
        { ticker: "SPY", name: "S&P 500" },
        { ticker: "VTV", name: "Large Cap" },
        { ticker: "IWS", name: "Mid Cap" },
        { ticker: "SLYV", name: "Small Cap" },
        { ticker: "VTIP", name: "Inflation Protected Treasuries" },
        { ticker: "MUB", name: "Muni Bonds" },
        { ticker: "AGG", name: "High Quality Bonds" },
        { ticker: "HYG", name: "Corporate High Yield Bonds" },
        { ticker: "SHV", name: "Short Term Treasuries" }
      ],
      interval: "5y",
      priceView: "change",
      axisTitle: "Change",
      axisUnits: "",
      returnedData: [],
      plotSeries: [],
      changeAxis: 1,
      portfolioWeightedQuotes: [],
      portfolioWeightedChange: [],
      dayOfWeek: 0
    };
  }

  componentDidMount() {
    this.getGlobalQuotes(this.state.interval, this.state.priceView);
    this.updatePortfolio();
    // this.analyzePortfolio();
  }

  // Function used to update portfolio ratios and a combined portfolio dataset
  updatePortfolio() {
    let weightPortfolioPrice = [];
    let weightPortfolioChange = [];

    if (this.state.returnedData.length > 0) {
      for (let i = 0; i < this.state.returnedData[0].yAxis.length; i++) {
        weightPortfolioPrice[i] = 0;
        weightPortfolioChange[i] = 0;
      }
    }

    this.setState({
      weightedReturn: 0,
      bondHoldings: this.state.bondValue,
      stockHoldings: 100 - this.state.bondValue,
      valueHoldings:
        (this.state.stockHoldings / 100) *
        (this.state.valueStockValue / 100) *
        100,
      SandPHoldings:
        (this.state.stockHoldings / 100) *
        (1 - this.state.valueStockValue / 100) *
        100,
      midSmallCapHoldings:
        (this.state.stockHoldings / 100) *
        (this.state.valueStockValue / 100) *
        (1 - this.state.largeValue / 100) *
        100,
      largeCapHoldings:
        (this.state.stockHoldings / 100) *
        (this.state.valueStockValue / 100) *
        (this.state.largeValue / 100) *
        100,
      smallCapHoldings:
        (this.state.midSmallCapHoldings / 100) *
        (1 - this.state.midValue / 100) *
        100,
      midCapHoldings:
        (this.state.midSmallCapHoldings / 100) *
        (this.state.midValue / 100) *
        100,
      corporateHoldings:
        (this.state.bondHoldings / 100) * this.state.corporateValue,
      governmentHoldings:
        (this.state.bondHoldings / 100) * (100 - this.state.corporateValue),
      muniHoldings:
        (this.state.governmentHoldings / 100) * this.state.muniValue,
      tipsHoldings:
        (this.state.governmentHoldings / 100) * (100 - this.state.muniValue),
      highYieldHoldings:
        (this.state.corporateHoldings / 100) * this.state.highYieldValue,
      highQualityHoldings:
        (this.state.corporateHoldings / 100) * (100 - this.state.highYieldValue)
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
        case "VTV":
          this.setState({
            weightedReturn:
              this.state.weightedReturn +
              (this.state.largeCapHoldings / 100) *
                this.state.returnedData[i].annualizedReturn
          });
          break;
        case "IWS":
          this.setState({
            weightedReturn:
              this.state.weightedReturn +
              (this.state.midCapHoldings / 100) *
                this.state.returnedData[i].annualizedReturn
          });
          break;
        case "SLYV":
          this.setState({
            weightedReturn:
              this.state.weightedReturn +
              (this.state.smallCapHoldings / 100) *
                this.state.returnedData[i].annualizedReturn
          });
          break;
        case "MUB":
          this.setState({
            weightedReturn:
              this.state.weightedReturn +
              (this.state.muniHoldings / 100) *
                this.state.returnedData[i].annualizedReturn
          });
          break;
        case "VTIP":
          this.setState({
            weightedReturn:
              this.state.weightedReturn +
              (this.state.tipsHoldings / 100) *
                this.state.returnedData[i].annualizedReturn
          });
          break;
        case "HYG":
          this.setState({
            weightedReturn:
              this.state.weightedReturn +
              (this.state.highYieldHoldings / 100) *
                this.state.returnedData[i].annualizedReturn
          });
          break;
        case "AGG":
          this.setState({
            weightedReturn:
              this.state.weightedReturn +
              (this.state.highQualityHoldings / 100) *
                this.state.returnedData[i].annualizedReturn
          });
          break;
        default:
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
            weightPortfolioChange[i] += weight * element.yAxisChange[i];
          }
          break;
        case "VTV":
          weight = this.state.largeCapHoldings / 100;
          for (let i = 0; i < element.yAxis.length; i++) {
            weightPortfolioPrice[i] += weight * element.yAxis[i];
            weightPortfolioChange[i] += weight * element.yAxisChange[i];
          }
          break;
        case "IWS":
          weight = this.state.midCapHoldings / 100;
          for (let i = 0; i < element.yAxis.length; i++) {
            weightPortfolioPrice[i] += weight * element.yAxis[i];
            weightPortfolioChange[i] += weight * element.yAxisChange[i];
          }
          break;
        case "SLYV":
          weight = this.state.smallCapHoldings / 100;
          for (let i = 0; i < element.yAxis.length; i++) {
            weightPortfolioPrice[i] += weight * element.yAxis[i];
            weightPortfolioChange[i] += weight * element.yAxisChange[i];
          }
          break;
        case "MUB":
          weight = this.state.muniHoldings / 100;
          for (let i = 0; i < element.yAxis.length; i++) {
            weightPortfolioPrice[i] += weight * element.yAxis[i];
            weightPortfolioChange[i] += weight * element.yAxisChange[i];
          }
          break;
        case "VTIP":
          weight = this.state.tipsHoldings / 100;
          for (let i = 0; i < element.yAxis.length; i++) {
            weightPortfolioPrice[i] += weight * element.yAxis[i];
            weightPortfolioChange[i] += weight * element.yAxisChange[i];
          }
          break;
        case "HYG":
          weight = this.state.highYieldHoldings / 100;
          for (let i = 0; i < element.yAxis.length; i++) {
            weightPortfolioPrice[i] += weight * element.yAxis[i];
            weightPortfolioChange[i] += weight * element.yAxisChange[i];
          }
          break;
        case "AGG":
          weight = this.state.highQualityHoldings / 100;
          for (let i = 0; i < element.yAxis.length; i++) {
            weightPortfolioPrice[i] += weight * element.yAxis[i];
            weightPortfolioChange[i] += weight * element.yAxisChange[i];
          }
          break;
        default:
          weight = 0;
      }
      // console.log(weightPortfolioPrice);
    });

    this.setState({
      portfolioWeightedQuotes: weightPortfolioPrice,
      portfolioWeightedChange: weightPortfolioChange
    });
  }

  handleBondChange(value) {
    this.setState({ bondValue: value });
    this.updatePortfolio();
    this.analyzePortfolio();
    this.plotData(this.state.changeAxis);
  }

  handleValueChange(value) {
    this.setState({
      valueStockValue: value
    });
    this.updatePortfolio();
    this.analyzePortfolio();
    this.plotData(this.state.changeAxis);
  }

  handleLargeCapChange(value) {
    this.setState({ largeValue: value });
    this.updatePortfolio();
    this.analyzePortfolio();
    this.plotData(this.state.changeAxis);
  }

  handleMidCapChange(value) {
    this.setState({ midValue: value });
    this.updatePortfolio();
    this.analyzePortfolio();
    this.plotData(this.state.changeAxis);
  }

  handleCorporateChange(value) {
    this.setState({ corporateValue: value });
    this.updatePortfolio();
    this.analyzePortfolio();
    this.plotData(this.state.changeAxis);
  }

  handleMuniChange(value) {
    this.setState({ muniValue: value });
    this.updatePortfolio();
    this.analyzePortfolio();
    this.plotData(this.state.changeAxis);
  }

  handleHighYieldChange(value) {
    this.setState({ highYieldValue: value });
    this.updatePortfolio();
    this.analyzePortfolio();
    this.plotData(this.state.changeAxis);
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

  plotData(axisInterval) {
    this.setState({
      plotSeries: [
        {
          name: "S&P 500",
          data: this.state.returnedData[this.state.baselineStockIndex]
            .yAxisChange,
          color: "black"
        },
        { name: "Portfolio", data: this.state.portfolioWeightedChange }
      ]
    });

    Highcharts.chart("portfolioChart", {
      legend: { enabled: true },
      title: {
        text: `Portfolio Performance`
      },
      xAxis: [
        {
          minPadding: 0.05,
          maxPadding: 0.05,
          tickInterval: axisInterval,
          categories: this.state.returnedData[this.state.baselineStockIndex]
            .xAxis
        }
      ],
      yAxis: [
        {
          title: { text: this.state.axisTitle },
          labels: {
            formatter: function() {
              return this.value + "%";
            }
          }
          // tickInterval: 1
        }
      ],

      tooltip: {
        valueDecimals: 2,
        valuePrefix: this.state.priceView === "price" ? "$" : "",
        valueSuffix: this.state.priceView === "price" ? "" : "%"
      },

      plotOptions: {
        line: {
          marker: {
            enabled: false
          }
        }
      },
      series: this.state.plotSeries
    });
  }

  getGlobalQuotes(userInterval, dataType) {
    this.setState({
      returnedData: [],
      interval: userInterval,
      priceView: dataType
    });

    // Adjust x axis depending on user selected time interval
    // let changeAxis = 1;
    let numberDays = 30;

    switch (userInterval) {
      case "1m":
        this.setState({ changeAxis: 1 });
        numberDays = 30;
        break;
      case "6m":
        this.setState({ changeAxis: 5 });
        numberDays = 180;
        break;
      case "1y":
        this.setState({ changeAxis: 10 });
        numberDays = 365;
        break;
      case "2y":
        this.setState({ changeAxis: 60 });
        numberDays = 730;
        break;
      case "5y":
        this.setState({ changeAxis: 180 });
        numberDays = 1825;
        break;
      default:
        this.setState({ changeAxis: 1 });
        numberDays = 30;
    }

    let tempValues = [];

    this.state.tickers.forEach(element => {
      API.getGlobalIndex({ ticker: element.ticker, interval: userInterval })
        .then(res => {
          let categories = [];
          let values = [];
          let ValuesChange = [];
          let indexData = {};
          let timeScale = "";
          let dataPoint = 0;
          let dataPointChange = 0;
          let lastPrice = res.data[res.data.length - 1].close;
          let returntoDate = res.data[res.data.length - 1].changeOverTime * 100;
          this.setState({ weightedReturn: 0 });

          // console.log(res.data);
          res.data.forEach(point => {
            timeScale = point.date;
            dataPoint = point.close;
            dataPointChange = point.changeOverTime * 100;
            categories.push(timeScale);
            values.push(dataPoint);
            ValuesChange.push(dataPointChange);
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
            yAxisChange: ValuesChange,
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

          // Once portfolio data has been updated calculate sharpe ratio and prepare data for charting

          if (
            this.state.baselineStockIndex !== -1 &&
            this.state.riskFreeIndex !== -1 &&
            this.state.portfolioWeightedQuotes.length > 0
          ) {
            this.setState({
              plotSeries: [
                {
                  name: "S&P 500",
                  data: this.state.returnedData[this.state.baselineStockIndex]
                    .yAxisChange,
                  color: "black"
                },
                { name: "Portfolio", data: this.state.portfolioWeightedChange }
              ]
            });
            this.analyzePortfolio();
          }

          // Start chart here
          this.plotData(this.state.changeAxis);
        })
        .catch(err => console.log(err));
    });
  }

  render() {
    return (
      <div className="m-5 px-3" id="portfolioArea">
        <h2>Build Your U.S. Markets Portfolio</h2>
        <div className="row">
          <p>
            Use this simple tool to estimate and visualize the effects
            diversification relative to a simple investment in U.S. equities as
            represented by the S&P 500 via the SPY ETF. The investor first
            chooses the balance of stocks and bond holdings, followed by a split
            between "value" stocks and large cap stocks. Value stocks are
            defined as having low and P/E or P/B relative to their peers in the
            same industry. The next two selection allow the user select a mix of
            company size as defined by their market capitalization. The last
            group of selectors allow the user to optimize their bond portfolio
            between government bonds which are lower risk, but also offer lower
            interest rate than typical corporate bonds. The investor can split
            his government bond portfolio between muni bonds issued by local
            government that offer tax advantages and inflation protected bonds
            offered by the federal government where the interest rates floats
            with CPI. The last choice is a split of corporate holdings between
            high yields bonds that often includes companies rated in the "junk"
            range carrying higher default risks, but also offering higher
            yields.
          </p>
        </div>
        <section className="row">
          <div className="col-md-4 portfolioSection">
            <div className="row">
              <div className="col-md-3">
                <p className="sliderHeader">Bonds {this.state.bondValue}%</p>
              </div>
              <div className="col-md-3">
                <p className="sliderHeader">
                  Value {this.state.valueStockValue}%
                </p>
              </div>
              <div className="col-md-3">
                <p className="sliderHeader">
                  Large Cap {this.state.largeValue}%
                </p>
              </div>
              <div className="col-md-3">
                <p className="sliderHeader">Mid Cap {this.state.midValue}%</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 sliderCol">
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
              <div className="col-md-3 sliderCol">
                <div className="slider orientation-reversed mx-auto">
                  <div className="slider-group">
                    <div className="slider-vertical">
                      <Slider
                        min={0}
                        max={100}
                        value={this.state.valueStockValue}
                        orientation="vertical"
                        onChange={this.handleValueChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 sliderCol">
                <div className="slider orientation-reversed mx-auto">
                  <div className="slider-group">
                    <div className="slider-vertical">
                      <Slider
                        min={0}
                        max={100}
                        value={this.state.largeValue}
                        orientation="vertical"
                        onChange={this.handleLargeCapChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 sliderCol">
                <div className="slider orientation-reversed mx-auto">
                  <div className="slider-group">
                    <div className="slider-vertical">
                      <Slider
                        min={0}
                        max={100}
                        value={this.state.midValue}
                        orientation="vertical"
                        onChange={this.handleMidCapChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <p className="sliderHeader">
                  Stocks {100 - this.state.bondValue}%
                </p>
              </div>
              <div className="col-md-3">
                <p className="sliderHeader">
                  S&P 500 {100 - this.state.valueStockValue}%
                </p>
              </div>
              <div className="col-md-3">
                <p className="sliderHeader">
                  Mid/Small Cap {100 - this.state.largeValue}%
                </p>
              </div>
              <div className="col-md-3">
                <p className="sliderHeader">
                  Small Cap {100 - this.state.midValue}%
                </p>
              </div>
            </div>

            {/* Start second row of sliders here */}
            <div className="row tableSpacer" />
            <div className="row">
              <div className="col-md-4">
                <p className="sliderHeader">
                  Corporate {this.state.corporateValue}%
                </p>
              </div>
              <div className="col-md-4">
                <p className="sliderHeader">
                  Muni Bonds {this.state.muniValue}%
                </p>
              </div>
              <div className="col-md-4">
                <p className="sliderHeader">
                  High Yield {this.state.highYieldValue}%
                </p>
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
                        value={this.state.corporateValue}
                        orientation="vertical"
                        onChange={this.handleCorporateChange}
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
                        value={this.state.muniValue}
                        orientation="vertical"
                        onChange={this.handleMuniChange}
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
                        value={this.state.highYieldValue}
                        orientation="vertical"
                        onChange={this.handleHighYieldChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <p className="sliderHeader">
                  Government {100 - this.state.corporateValue}%
                </p>
              </div>
              <div className="col-md-4">
                <p className="sliderHeader">
                  TIPS {100 - this.state.muniValue}%
                </p>
              </div>
              <div className="col-md-4">
                <p className="sliderHeader">
                  High Quality {100 - this.state.highYieldValue}%
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            {/* Start Portfolio breakdown table here */}
            <div className="row">
              <div className="col-md-6 portfolioSection">
                <div className="row justify-content-center">
                  <p className="sliderHeader">Recommended Portfolio</p>
                </div>
                <div className="row">
                  {/* First column in portfolio table */}
                  <div className="col-md-5 my-auto portfolioTable">
                    <div className="row tableSpacer" />
                    <div className="row portfolioRow">
                      {" "}
                      <p className="portfolioItem">S&P 500 (SPY)</p>
                    </div>
                    <div className="row portfolioRow">
                      <p className="portfolioItem">Large Cap Stocks (VTV)</p>
                    </div>
                    <div className="row portfolioRow">
                      <p className="portfolioItem">Mid Cap Stocks (IWS)</p>
                    </div>
                    <div className="row portfolioRow">
                      <p className="portfolioItem">Small Cap Stocks (SLYV)</p>
                    </div>
                    <div className="row portfolioRow">
                      <p className="portfolioItem">Muni Bonds (MUB)</p>
                    </div>
                    <div className="row portfolioRow">
                      <p className="portfolioItem">TIPS Bonds (VTIP)</p>
                    </div>
                    <div className="row portfolioRow">
                      <p className="portfolioItem">High Yield Bonds (HYG)</p>
                    </div>
                    <div className="row portfolioRow">
                      <p className="portfolioItem">High Quality Bonds (AGG)</p>
                    </div>
                  </div>
                  {/* Second column in portfolio table */}
                  <div className="col-md-1 my-auto portfolioTable">
                    <div className="row tableSpacer" />
                    <div className="row portfolioRow">
                      {" "}
                      <p className="portfolioItem">
                        {this.state.SandPHoldings.toFixed(2)}%
                      </p>
                    </div>
                    <div className="row portfolioRow">
                      <p className="portfolioItem">
                        {this.state.largeCapHoldings.toFixed(2)}%
                      </p>
                    </div>
                    <div className="row portfolioRow">
                      <p className="portfolioItem">
                        {this.state.midCapHoldings.toFixed(2)}%
                      </p>
                    </div>
                    <div className="row portfolioRow">
                      <p className="portfolioItem">
                        {this.state.smallCapHoldings.toFixed(2)}%
                      </p>
                    </div>
                    <div className="row portfolioRow">
                      <p className="portfolioItem">
                        {this.state.muniHoldings.toFixed(2)}%
                      </p>
                    </div>
                    <div className="row portfolioRow">
                      <p className="portfolioItem">
                        {this.state.tipsHoldings.toFixed(2)}%
                      </p>
                    </div>
                    <div className="row portfolioRow">
                      <p className="portfolioItem">
                        {this.state.highYieldHoldings.toFixed(2)}%
                      </p>
                    </div>
                    <div className="row portfolioRow">
                      <p className="portfolioItem">
                        {this.state.highQualityHoldings.toFixed(2)}%
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
                      {" "}
                      <p className="sliderHeader">Annualized Gain</p>
                    </div>
                    <div className="row justify-content-center">
                      <p className="weightedReturn">
                        {this.state.weightedReturn.toFixed(1)}%
                      </p>
                    </div>

                    <div className="row justify-content-center">
                      {" "}
                      <p className="sliderHeader">Sharpe Ratio*</p>
                    </div>
                    <div className="row justify-content-center">
                      S&P 500: {this.state.baselineSharpeRatio.toFixed(3)}
                    </div>
                    <div className="row justify-content-center">
                      Portfolio: {this.state.targetStockShapeRatio.toFixed(3)}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <p id="sharpeDescribe">
                    *The Sharpe ratio is a measure of incremental return above a
                    "risk free" alternative per unit of risk undertaken with the
                    investment as defined by volatility. A higher Sharpe ratio
                    indicates a higher compensation for the amount of risk taken
                    by the investor. The "risk free" alternative assumed is
                    represented by short term U.S. Treasuries via the SHV ETF.
                  </p>
                </div>
              </div>

              {/* Start Chart Here */}

              <div
                className="col-md-6 my-auto"
                id="portfolioChart"
                style={{ height: "450px" }}
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default USPortfolio;
