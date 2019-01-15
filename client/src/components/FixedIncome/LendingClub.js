import React, { Component } from "react";
import "./Sections.css";
import API from "../../utils/API";
import Highcharts from "highcharts";
import moment from "moment-timezone";

class LendingClub extends Component {
  constructor(props) {
    super(props);

    this.getSummary = this.getSummary.bind(this);
  }

  componentDidMount() {
    this.getSummary();
  }

  getSummary() {
    API.getLendingClubSummary()
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }
  render() {
    return (
      <div className="m-5 px-3">
        <section className="row">
          <p>Text talking about lending club</p>
        </section>
      </div>
    );
  }
}

export default LendingClub;
