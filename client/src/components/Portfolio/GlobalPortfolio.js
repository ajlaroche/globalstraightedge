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

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      value: 50
    };
  }

  handleChange(value) {
    this.setState({ value: value });
  }

  render() {
    return (
      <div className="m-5 px-3">
        <h2>Build Your Global Portfolio</h2>
        <section className="row">
          <div className="col-md-4 my-auto">
            {/* <div className="slidecontainer">
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={this.state.value}
                onChange={this.handleChange}
                className="slider"
                id="myRange"
              />
            </div> */}

            <div className="slider orientation-reversed">
              <div className="slider-group">
                <div className="slider-vertical">
                  <Slider
                    min={0}
                    max={100}
                    value={this.state.value}
                    orientation="vertical"
                    onChange={this.handleChange}
                  />
                  <div className="value">{this.state.value}</div>
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
