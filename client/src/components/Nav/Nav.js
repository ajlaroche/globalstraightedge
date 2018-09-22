import React, { Component } from "react";
import "./Nav.css";

class Nav extends Component {
  render() {
    const { active } = this.props;

    const pages = [
      "US Economy",
      "Global Economy",
      "Stock Markets",
      "Fixed Income",
      "Forex",
      "Cryptocurrency",
      "Magazine"
    ];

    return (
      <ul className="nav justify-content-center">
        {pages.map(page => (
          <li className="nav-item mx-5" key={page}>
            <a
              href=""
              className={active === page ? "nav-link disabled" : "nav-link"}
            >
              {page}
            </a>
          </li>
        ))}
      </ul>
    );
  }
}

export default Nav;
