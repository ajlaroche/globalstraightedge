import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Jumbotron from "./components/Jumbotron";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import { Container } from "./components/Grid";
import Ticker from "./components/Ticker";

class App extends Component {
  render() {
    return (
      <div>
        <Jumbotron />
        <Ticker />
        <Container fluid other="mainBody">
          <Nav active="US Economy" />
        </Container>
        <Footer />
      </div>
    );
  }
}

export default App;
