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

    this.state = {
      globalValue: 50,
      developedValue: 50,
      bondValue: 50,
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

  handleGlobalChange(value) {
    this.setState({ globalValue: value });
  }

  handleDevelopedChange(value) {
    this.setState({ developedValue: value });
  }

  handleBondChange(value) {
    this.setState({ bondValue: value });
  }

  render() {
    return (
      <div className="m-5 px-3">
        <h2>Build Your Global Portfolio</h2>
        <section className="row">
          <div className="col-md-4 my-auto portfolioSection">
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
              <div className="col-md-4 portfolioTable">
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
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default GlobalPortfolio;
