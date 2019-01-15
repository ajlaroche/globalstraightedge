import React from "react";
import Nav from "../../components/Nav";
import { Container } from "../../components/Grid";
import LendingClub from "../../components/FixedIncome/LendingClub";

const FixedIncomeView = () => (
  <div>
    <Nav active="Fixed Income" />
    <Container fluid other="mainBody">
      <LendingClub />
    </Container>
  </div>
);

export default FixedIncomeView;
