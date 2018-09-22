import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Jumbotron from "./components/Jumbotron";
import Nav from "./components/Nav";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Jumbotron />
        <Nav active="US Economy" />
      </div>
    );
  }
}

export default App;
