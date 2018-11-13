import React from "react";
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";
import USEconomy from "../../components/dashboards";
import Employment from "../../components/USSections/Employment";
import GDP from "../../components/USSections/GDP";
import YieldCurve from "../../components/USSections/YieldCurve";
import Housing from "../../components/USSections/Housing";

const USView = () => (
  <div>
    <Nav active="US Economy" />
    <Container fluid other="mainBody">
      <USEconomy />
      <Employment />
      <GDP />
      <YieldCurve />
      <Housing />
    </Container>
  </div>
);

export default USView;
