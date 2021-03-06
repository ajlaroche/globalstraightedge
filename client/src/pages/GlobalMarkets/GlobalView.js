import React from "react";
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";
import GlobalPortfolio from "../../components/Portfolio/GlobalPortfolio";
import DevelopedStock from "../../components/GlobalMarkets/DevelopedStock";
import EmergingStock from "../../components/GlobalMarkets/EmergingStock";
import DevelopedBond from "../../components/GlobalMarkets/DevelopedBond";
import EmergingBond from "../../components/GlobalMarkets/EmergingBond";

const GlobalView = () => (
  <div>
    <Nav active="Global Markets" />
    <Container fluid other="mainBody">
      <GlobalPortfolio />
      <DevelopedStock />
      <EmergingStock />
      <DevelopedBond />
      <EmergingBond />
    </Container>
  </div>
);

export default GlobalView;
