import React from "react";
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";
import USEconomy from "../../components/dashboards";

const USView = () => (
  <div>
    <Nav active="US Economy" />
    <Container fluid other="mainBody">
      <USEconomy />
    </Container>
  </div>
);

export default USView;
