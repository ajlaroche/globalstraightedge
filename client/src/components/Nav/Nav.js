import React, { Component } from "react";
import "./Nav.css";
import { Link } from "react-router-dom";

class Nav extends Component {
  render() {
    const { active } = this.props;

    const pages = [
      { title: "US Economy", address: "/" },
      { title: "Global Markets", address: "/global" },
      { title: "US Equities", address: "/equities" },
      { title: "Fixed Income", address: "/fixedincome" },
      { title: "Forex", address: "/forex" },
      { title: "Cryptocurrency", address: "/cryto" },
      { title: "Magazine", address: "/magazine" }
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
              <li className="nav-item mx-auto" key={page.title}>
                <Link
                  to={page.address}
                  className={
                    active === page.title ? "nav-link disabled" : "nav-link"
                  }
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }
}

export default Nav;
