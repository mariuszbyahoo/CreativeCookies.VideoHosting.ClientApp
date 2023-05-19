import React, { useState } from "react";
import {
  Collapse,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";
import { Navbar } from "reactstrap";
import { Link } from "react-router-dom";
import "./NavMenu.css";
import LoginComponent from "./Account/Login";
import RegisterComponent from "./Account/Register";
import LogoutComponent from "./Account/Logout";
import { useAuth } from "./Account/AuthContext";

const NavMenu = () => {
  const { isAuthenticated, userEmail } = useAuth();
  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  const accountNav = () => {
    if (isAuthenticated && userEmail && userEmail.length > 0) {
      let link = `https://${process.env.REACT_APP_API_ADDRESS}/Identity/Account/Manage`;
      return (
        <>
          <NavItem>
            <a href={link} className="nav-link text-dark">
              {userEmail.toLowerCase()}
            </a>
          </NavItem>
          <NavItem>
            <LogoutComponent className="text-dark  nav-link" />
          </NavItem>
        </>
      );
    } else {
      return (
        <>
          <NavItem>
            <LoginComponent className="text-dark  nav-link" />
          </NavItem>
          <NavItem>
            <RegisterComponent className="text-dark  nav-link" />
          </NavItem>
        </>
      );
    }
  };

  return (
    <header>
      <Navbar
        className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
        container
        light
      >
        <NavbarBrand tag={Link} to="/">
          MyHub
        </NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse
          className="d-sm-inline-flex flex-sm-row-reverse"
          isOpen={!collapsed}
          navbar
        >
          <ul className="navbar-nav flex-grow">
            <NavItem>
              <NavLink tag={Link} className="text-dark" to="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} className="text-dark" to="/films-list">
                Films list
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} className="text-dark" to="/films-upload">
                Film upload
              </NavLink>
            </NavItem>
            {accountNav()}
          </ul>
        </Collapse>
      </Navbar>
    </header>
  );
};

export default NavMenu;
