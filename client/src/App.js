import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Jumbotron from "./components/Jumbotron";
import Footer from "./components/Footer";
import USView from "./pages/USEconomy";
import Ticker from "./components/Ticker";

class App extends Component {
  render() {
    return (
      <div>
        <Jumbotron />
        <Ticker />
        <USView />
        <Footer />
      </div>
    );
  }
}

export default App;
