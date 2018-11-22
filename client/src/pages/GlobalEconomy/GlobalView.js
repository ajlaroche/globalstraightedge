import React from "react";
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";
import DevelopedStock from "../../components/GlobalSections/DevelopedStock";
import EmergingStock from "../../components/GlobalSections/EmergingStock";

const GlobalView = () => (
  <div>
    <Nav active="Global Markets" />
    <Container fluid other="mainBody">
      <DevelopedStock />
      <EmergingStock />
    </Container>
  </div>
);

export default GlobalView;
