import React from "react";
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";

const GlobalView = () => (
  <div>
    <Nav active="Global Markets" />
    <Container fluid other="mainBody" />
  </div>
);

export default GlobalView;
