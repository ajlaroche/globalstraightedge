import React from "react";
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";
import TotalStockMarket from "../../components/USMarkets/TotalStockMarket";

const USMarketsView = () => (
  <div>
    <Nav active="US Markets" />
    <Container fluid other="mainBody">
      <TotalStockMarket />
    </Container>
  </div>
);

export default USMarketsView;
