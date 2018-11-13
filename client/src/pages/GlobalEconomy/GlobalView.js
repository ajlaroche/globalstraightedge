import React from "react";
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";
import DevelopedStock from "../../components/GlobalSections/DevelopedStock";

const GlobalView = () => (
  <div>
    <Nav active="Global Markets" />
    <Container fluid other="mainBody">
      <DevelopedStock />
    </Container>
  </div>
);

export default GlobalView;
