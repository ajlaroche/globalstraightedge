import React from "react";
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";
import DevelopedStock from "../../components/GlobalSections/DevelopedStock";
import EmergingStock from "../../components/GlobalSections/EmergingStock";
import DevelopedBond from "../../components/GlobalSections/DevelopedBond";
import EmergingBond from "../../components/GlobalSections/EmergingBond";

const GlobalView = () => (
  <div>
    <Nav active="Global Markets" />
    <Container fluid other="mainBody">
      <DevelopedStock />
      <EmergingStock />
      <DevelopedBond />
      <EmergingBond />
    </Container>
  </div>
);

export default GlobalView;
