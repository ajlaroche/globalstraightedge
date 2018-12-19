import React from "react";
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";
import TotalStockMarket from "../../components/USMarkets/TotalStockMarket";
import ValueStocks from "../../components/USMarkets/ValueStocks";

const USMarketsView = () => (
  <div>
    <Nav active="US Markets" />
    <Container fluid other="mainBody">
      <TotalStockMarket />
      <ValueStocks />
    </Container>
  </div>
);

export default USMarketsView;
