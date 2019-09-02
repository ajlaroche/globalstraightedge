import React from "react";
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";
import RealEstate from "../../components/RealEstate";

const RealEstateView = () => (
  <div>
    <Nav active="Real Estate" />
    <Container fluid other="mainBody">
      <RealEstate />
    </Container>
  </div>
);

export default RealEstateView;
