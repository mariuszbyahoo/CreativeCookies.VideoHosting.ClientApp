import React, { useEffect, useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";
import "./NavMenu.css";
import LoginComponent from "./Account/Login";
import RegisterComponent from "./Account/Register";
import LogoutLinkComponent from "./Account/LogoutLink";
import { useAuth } from "./Account/AuthContext";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  CheckCircleOutlineRounded,
  ErrorOutlineOutlined,
  HighlightOffRounded,
  HourglassBottomRounded,
  Info,
  KeyboardArrowDownRounded,
  SettingsRounded,
} from "@mui/icons-material";
import ConfirmationDialog from "./ConfirmationDialog";

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
    refreshTokens,
  } = useAuth();
  const [collapsed, setCollapsed] = useState(true);
  const [paymentNavContent, setPaymentNavContent] = useState(<></>);
  const [confirmationDialogMsg, setDialogMsg] = useState("");
  const [isConfirmationDialogOpened, setIsConfirmationDialogOpened] =
    useState(false);
  const [messageDialogText, setMessageDialogText] = useState("");
  const [messageDialogTitle, setMessageDialogTitle] = useState("");
  const [isMessageDialogOpened, setIsMessageDialogOpened] = useState(false);
  const [messageDialogHasCancelOption, setMessageDialogHasCancelOption] =
    useState(true);

  useEffect(() => {
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
  }, [
    userRole,
    isAwaitingForSubscription,
    stripeAccountStatus,
    stripeAccountVerificationPending,
    subscriptionStartDateLocal,
  ]);

  const closeMessageDialog = () => {
    setIsMessageDialogOpened(false);
    setMessageDialogText("");
    setMessageDialogTitle("");
  };

  const handleSubscriberPaymentNav = () => {
    subscriptionStartDateLocal &&
      setPaymentNavContent(
        <>
          <NavItem className="text-green">
            Membership renewal at:{" "}
            {subscriptionStartDateLocal.format("DD.MM.YYYY")}
          </NavItem>
        </>
      );
  };

  const handleNonSubscriberPaymentNav = () => {
    subscriptionStartDateLocal &&
      setDialogMsg(
        <>
          Your subscription will be active from:{" "}
          {subscriptionStartDateLocal.format("DD.MM.YYYY")}, you can cancel this
          order till the above date to receive a costless refund.
          <br />
          For more info, visit:
          <br />
          <a
            href="https://europa.eu/youreurope/citizens/consumers/shopping/guarantees-returns/index_en.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            EU's website
          </a>
        </>
      );
    if (isAwaitingForSubscription) {
      subscriptionStartDateLocal &&
        setPaymentNavContent(
          <>
            <NavItem>
              Awaiting access
              <IconButton onClick={() => setIsConfirmationDialogOpened(true)}>
                <Info style={{ color: "purple" }} />
              </IconButton>
            </NavItem>
          </>
        );
    } else {
      setPaymentNavContent(
        <>
          <NavItem className="text-purple">
            <Link to="/subscribe">Subscribe</Link>
          </NavItem>
        </>
      );
    }
  };

  const handleAdminPaymentNav = () => {
    switch (stripeAccountStatus.data) {
      case 1:
        setPaymentNavContent(
          <>
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

  const handleConfirmationDialogConfirm = async () => {
    const res = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/Users/OrderCancellation`,
      {
        credentials: "include",
        method: "POST",
      }
    );
    if (res) {
      setIsConfirmationDialogOpened(false);
      await refreshTokens(false);
      setMessageDialogText(
        "Refund has been initiated, you should receive your funds within 30 days"
      );
      setMessageDialogTitle("Order canceled");
      setIsMessageDialogOpened(true);
    } else
      console.error(
        `An error occured while sending request to cancel an order for subscription`
      );
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
    <>
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
      <ConfirmationDialog
        title="Cooling off period"
        message={confirmationDialogMsg}
        open={isConfirmationDialogOpened}
        hasCancelOption={true}
        onConfirm={() => {
          handleConfirmationDialogConfirm();
        }}
        onCancel={() => setIsConfirmationDialogOpened(false)}
        confirmBtnMsg="Cancel order"
        cancelBtnMsg="Close window"
      ></ConfirmationDialog>
      <Dialog open={isMessageDialogOpened} onCancel={closeMessageDialog}>
        <DialogTitle>{messageDialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{messageDialogText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {messageDialogHasCancelOption && (
            <Button onClick={closeMessageDialog}>Close</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NavMenu;
