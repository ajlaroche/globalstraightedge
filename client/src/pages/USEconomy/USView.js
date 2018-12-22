import React from "react";
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";
import USEconomy from "../../components/dashboards";
import Employment from "../../components/Economy/Employment";
import GDP from "../../components/Economy/GDP";
import YieldCurve from "../../components/Economy/YieldCurve";
import Housing from "../../components/Economy/Housing";

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
