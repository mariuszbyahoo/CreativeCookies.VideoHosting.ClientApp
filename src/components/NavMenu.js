import React, { useEffect, useState } from "react";
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
import LogoutLinkComponent from "./Account/LogoutLink";
import { useAuth } from "./Account/AuthContext";
import { CircularProgress, IconButton, Menu, MenuItem } from "@mui/material";
import {
  CheckCircleOutlineRounded,
  ErrorOutlineOutlined,
  HighlightOffRounded,
  HourglassBottomRounded,
  KeyboardArrowDownRounded,
  SettingsRounded,
} from "@mui/icons-material";

const NavMenu = () => {
  const {
    isAuthenticated,
    userEmail,
    userRole,
    isUserMenuLoading,
    stripeAccountStatus,
    stripeAccountVerificationPending,
    isAwaitingForSubscription,
    subscriptionStartDateLocal,
    subscriptionEndDateLocal,
  } = useAuth();
  const [collapsed, setCollapsed] = useState(true);
  const [paymentNavContent, setPaymentNavContent] = useState(<></>);

  //Hack: this first of all should check the user's role
  // If user role = admin:
  // run current switch(stripeAccountStatus.data) block
  // else setPaymentNavContent with it's role, and if role === nonSubscriber
  // then add button directing to "subscribe"
  // else if role === Subscriber
  // then display role "Subscriber" and display subscription dates

  useEffect(() => {
    debugger;
    if (userRole === "admin" || userRole === "ADMIN") {
      handleAdminPaymentNav();
    } else {
      if (
        userRole === "Subscriber" ||
        userRole === "SUBSCRIBER" ||
        userRole === "subscriber"
      ) {
        handleSubscriberPaymentNav();
      } else if (
        userRole === "NonSubscriber" ||
        userRole === "NONSUBSCRIBER" ||
        userRole === "nonsubscriber"
      ) {
        handleNonSubscriberPaymentNav();
      } else {
        setPaymentNavContent(<></>);
      }
    }
  }, [userRole, stripeAccountStatus, stripeAccountVerificationPending]);

  const handleSubscriberPaymentNav = () => {
    setPaymentNavContent(
      <>
        <p>
          Membership renewal at:{" "}
          {subscriptionStartDateLocal.format("YYYY-MM-DD HH:mm:ss")}
        </p>
      </>
    );
  };

  const handleNonSubscriberPaymentNav = () => {
    if (isAwaitingForSubscription) {
      setPaymentNavContent(
        <>
          <p>Access from: {subscriptionStartDateLocal}</p>
        </>
      );
    } else {
      setPaymentNavContent(
        <>
          <p>Subscribe! - link</p>
        </>
      );
    }
  };

  const handleAdminPaymentNav = () => {
    switch (stripeAccountStatus.data) {
      case 1:
        setPaymentNavContent(
          <>
            <span style={{ fontWeight: 300, fontSize: 9, marginRight: "1%" }} />
            <NavItem className="text-purple">
              Stripe <CircularProgress size={10} />
            </NavItem>
            <span style={{ fontWeight: 300, fontSize: 9, marginRight: "1%" }}>
              partners with:
            </span>
            <NavItem className="no-wrap">
              <a
                className="nav-link text-orange"
                href={`https://${process.env.REACT_APP_API_ADDRESS}/Identity/Account/StripeOnboarding`}
              >
                Stripe <ErrorOutlineOutlined />
              </a>
            </NavItem>
          </>
        );
        break;
      case 2:
        setPaymentNavContent(
          <>
            <span style={{ fontWeight: 300, fontSize: 9, marginRight: "1%" }}>
              partners with:
            </span>
            <NavItem className="no-wrap text-green">
              Stripe <CheckCircleOutlineRounded />
              <Link to="/stripeProductsDashboard">
                <IconButton>
                  <SettingsRounded style={{ color: "black" }} />
                </IconButton>
              </Link>
            </NavItem>
          </>
        );
        break;
      case 3:
        setPaymentNavContent(
          <>
            <span style={{ fontWeight: 300, fontSize: 9, marginRight: "1%" }}>
              partners with:
            </span>{" "}
            <NavItem className="no-wrap text-purple">
              Stripe <HourglassBottomRounded />
            </NavItem>
          </>
        );
        break;
      default:
        setPaymentNavContent(
          <>
            <span style={{ fontWeight: 300, fontSize: 9, marginRight: "1%" }}>
              partners with:
            </span>{" "}
            <NavItem className="text-red">
              <a
                className="nav-link"
                href={`https://${process.env.REACT_APP_API_ADDRESS}/Identity/Account/StripeOnboarding`}
              >
                Stripe <HighlightOffRounded />
              </a>
            </NavItem>
          </>
        );
        break;
    }
  };

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  const accountNav = () => {
    if (isUserMenuLoading) {
      return <CircularProgress />;
    }
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
            <LogoutLinkComponent className="text-dark  nav-link" />
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

  const filmUploadComponent = () => {
    if (userRole === "ADMIN" || userRole === "admin")
      return (
        <>
          <NavItem>
            <NavLink tag={Link} className="text-dark" to="/films-upload">
              Film upload
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} className="text-dark" to="/users-list">
              Users list
            </NavLink>
          </NavItem>
        </>
      );
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
        {paymentNavContent}
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
            {filmUploadComponent()}
            {accountNav()}
          </ul>
        </Collapse>
      </Navbar>
    </header>
  );
};

export default NavMenu;
