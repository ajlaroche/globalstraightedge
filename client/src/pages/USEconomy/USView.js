import React from "react";
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";
import USEconomy from "../../components/dashboards";
import Employment from "../../components/Sections/Employment";

const USView = () => (
  <div>
    <Nav active="US Economy" />
    <Container fluid other="mainBody">
      <USEconomy />
      <Employment />
    </Container>
  </div>
);

export default USView;
