import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Jumbotron from "./components/Jumbotron";
import Footer from "./components/Footer";
import USView from "./pages/USEconomy";
import GlobalView from "./pages/GlobalMarkets";
import USMarkets from "./pages/USMarkets";
import FixedIncome from "./pages/FixedIncome";
import NoMatch from "./pages/NoMatch";
import Ticker from "./components/Ticker";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Jumbotron />
          <Ticker />
          <Switch>
            <Route exact path="/" component={USView} />
            <Route exact path="/global" component={GlobalView} />
            <Route exact path="/usmarkets" component={USMarkets} />
            <Route exact path="/fixedincome" component={FixedIncome} />
            <Route component={NoMatch} />
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
