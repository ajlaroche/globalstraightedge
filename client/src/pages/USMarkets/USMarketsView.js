import React from "react";
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";
import USPortfolio from "../../components/Portfolio/USPortfolio";
import TotalStockMarket from "../../components/USMarkets/TotalStockMarket";
import ValueStocks from "../../components/USMarkets/ValueStocks";
import GovernmentBonds from "../../components/USMarkets/GovernmentBonds";
import CorporateBonds from "../../components/USMarkets/CorporateBonds";

const USMarketsView = () => (
  <div>
    <Nav active="US Markets" />
    <Container fluid other="mainBody">
      <USPortfolio />
      <TotalStockMarket />
      <ValueStocks />
      <GovernmentBonds />
      <CorporateBonds />
    </Container>
  </div>
);

export default USMarketsView;
