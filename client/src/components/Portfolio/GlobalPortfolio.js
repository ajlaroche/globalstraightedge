import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import Highcharts from "highcharts";
import Slider from "react-rangeslider";
// To include the default styles
import "react-rangeslider/lib/index.css";

class GlobalPortfolio extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleGlobalChange = this.handleGlobalChange.bind(this);
    this.handleDevelopedChange = this.handleDevelopedChange.bind(this);
    this.handleBondChange = this.handleBondChange.bind(this);
    this.updatePortfolio = this.updatePortfolio.bind(this);

    this.state = {
      globalValue: 50,
      developedValue: 50,
      bondValue: 50,
      SandPHoldings: 50,
      developedStocksHoldings: 50,
      emergingStocksHoldings: 50,
      emergingBondHoldings: 50,
      developedBondHoldings: 50,
      tickers: [
        { ticker: "VEA", name: "Developed Markets" },
        { ticker: "SPY", name: "S&P 500" },
        { ticker: "UUP", name: "U.S. Dollar Index" },
        { ticker: "BNDX", name: "International Bond" },
        { ticker: "EMB", name: "Emerging Bonds" },
        { ticker: "IEMG", name: "Emerging Stocks" }
      ]
    };
  }

  componentDidMount() {
    this.updatePortfolio();
  }

  updatePortfolio() {
    this.setState({
      SandPHoldings: 100 - this.state.globalValue,
      developedStocksHoldings:
        (((((this.state.globalValue / 100) * this.state.developedValue) / 100) *
          (100 - this.state.bondValue)) /
          100) *
        100,
      developedBondHoldings:
        (((((this.state.globalValue / 100) * this.state.developedValue) / 100) *
          this.state.bondValue) /
          100) *
        100,
      emergingStocksHoldings:
        (((((this.state.globalValue / 100) *
          (100 - this.state.developedValue)) /
          100) *
          (100 - this.state.bondValue)) /
          100) *
        100,
      emergingBondHoldings:
        (((((this.state.globalValue / 100) *
          (100 - this.state.developedValue)) /
          100) *
          this.state.bondValue) /
          100) *
        100
    });
  }

  handleGlobalChange(value) {
    this.setState({ globalValue: value });
    this.updatePortfolio();
  }

  handleDevelopedChange(value) {
    this.setState({ developedValue: value });
    this.updatePortfolio();
  }

  handleBondChange(value) {
    this.setState({ bondValue: value });
    this.updatePortfolio();
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
                      // onClick={() =>
                      //   this.updateQuotes("1d", this.state.priceView)
                      // }
                    >
                      1Mo
                    </button>
                    |
                    <button
                      type="button"
                      className="btn btn-link"
                      // onClick={() =>
                      //   this.updateQuotes("1m", this.state.priceView)
                      // }
                    >
                      6 Mo
                    </button>{" "}
                    |{" "}
                    <button
                      type="button"
                      className="btn btn-link"
                      // onClick={() =>
                      //   this.updateQuotes("1y", this.state.priceView)
                      // }
                    >
                      1 Yr
                    </button>{" "}
                    |{" "}
                    <button
                      type="button"
                      className="btn btn-link"
                      // onClick={() =>
                      //   this.updateQuotes("5y", this.state.priceView)
                      // }
                    >
                      5 Yr
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Start Chart Here */}

          <div
            className="col-md-4"
            id="portfolioChart"
            style={{ height: "400px" }}
          />
        </section>
      </div>
    );
  }
}

export default GlobalPortfolio;
