import React, { Component } from "react";
import "./Nav.css";

class Nav extends Component {
  render() {
    const { active } = this.props;

    const pages = [
      "US Economy",
      "Global Markets",
      "US Equities",
      "Fixed Income",
      "Forex",
      "Cryptocurrency",
      "Magazine"
    ];

    return (
      <nav className="navbar navbar-expand-lg  navbar-light bg-light">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav w-100">
            {pages.map(page => (
              <li className="nav-item mx-auto" key={page}>
                <a
                  href=""
                  className={active === page ? "nav-link disabled" : "nav-link"}
                >
                  {page}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }
}

export default Nav;
