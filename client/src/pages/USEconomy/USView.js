import React from "react";
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";
import USEconomy from "../../components/dashboards";
import Employment from "../../components/Sections/Employment";
import GDP from "../../components/Sections/GDP";
import YieldCurve from "../../components/Sections/YieldCurve";
import Housing from "../../components/Sections/Housing";

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
