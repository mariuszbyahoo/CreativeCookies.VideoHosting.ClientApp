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
  const [coolingOffPeriodCancelDialogMsg, setConfirmationDialogMsg] =
    useState("");
  const [
    isCoolingOffPeriodCancelDialogOpened,
    setCoolingOffPeriodCancelDialogOpened,
  ] = useState(false);
  const [isMembershipDialogOpened, setIsMembershipDialogOpened] =
    useState(false);
  const [
    isCoolingOffPeriodMessageDialogOpened,
    setIsCoolingOffPeriodMessageDialogOpened,
  ] = useState(false);
  const [
    isSubscriptionCanceledDialogOpened,
    setIsSubscriptionCanceledDialogOpened,
  ] = useState(false);
  const [subscriptionCanceledDialogMessage, setSubscriptionCanceledDialogMsg] =
    useState("");
  const [
    isSubscriptionAlreadyCanceledDialogOpened,
    setIsSubscriptionAlreadyCanceledDialogOpened,
  ] = useState(false);

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

  const closeSubscriptionCanceledDialog = () => {
    setIsSubscriptionCanceledDialogOpened(false);
  };

  const closeCoolingOffPeriodMessageDialog = () => {
    setIsCoolingOffPeriodMessageDialogOpened(false);
  };

  const openMembershipDialog = () => {
    setIsMembershipDialogOpened(true);
  };
  const closeMembershipDialog = () => {
    setIsMembershipDialogOpened(false);
  };

  const cancelSubscription = async () => {
    closeMembershipDialog();
    try {
      const res = await fetch(
        `https://${process.env.REACT_APP_API_ADDRESS}/Users/SubscriptionCancellation`,
        {
          credentials: "include",
          method: "POST",
        }
      );
      if (res.ok) {
        setSubscriptionCanceledDialogMsg("Subscription canceled successfully");
        setIsSubscriptionCanceledDialogOpened(true);
      } else if (res.status === 402) {
        setIsSubscriptionAlreadyCanceledDialogOpened(true);
      } else {
        setSubscriptionCanceledDialogMsg(
          "Error occured during your subscription cancelation, please contact administrator"
        );
        setIsSubscriptionCanceledDialogOpened(true);
      }
    } catch (error) {
      console.error("An error occured, please investigate");
    }
  };

  const handleSubscriberPaymentNav = () => {
    subscriptionStartDateLocal &&
      setPaymentNavContent(
        <>
          <NavItem className="text-green">
            Premium membership{" "}
            <IconButton onClick={() => openMembershipDialog()}>
              <SettingsRounded style={{ color: "black" }} />
            </IconButton>
          </NavItem>
        </>
      );
  };

  const handleNonSubscriberPaymentNav = () => {
    subscriptionStartDateLocal &&
      setConfirmationDialogMsg(
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
              <IconButton
                onClick={() => setCoolingOffPeriodCancelDialogOpened(true)}
              >
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

  const handleCoolingOffPeriodCancelDialogConfirm = async () => {
    const res = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/Users/OrderCancellation`,
      {
        credentials: "include",
        method: "POST",
      }
    );
    if (res) {
      setCoolingOffPeriodCancelDialogOpened(false);
      await refreshTokens(false);
      setIsCoolingOffPeriodMessageDialogOpened(true);
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
        message={coolingOffPeriodCancelDialogMsg}
        open={isCoolingOffPeriodCancelDialogOpened}
        hasCancelOption={true}
        onConfirm={() => {
          handleCoolingOffPeriodCancelDialogConfirm();
        }}
        onCancel={() => setCoolingOffPeriodCancelDialogOpened(false)}
        confirmBtnMsg="Cancel order"
        cancelBtnMsg="Close window"
      ></ConfirmationDialog>

      <Dialog
        open={isCoolingOffPeriodMessageDialogOpened}
        onCancel={closeCoolingOffPeriodMessageDialog}
      >
        <DialogTitle>Order canceled</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Refund has been initiated, you should receive your funds within 30
            days
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCoolingOffPeriodMessageDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isSubscriptionAlreadyCanceledDialogOpened}
        onCancel={() => setIsSubscriptionAlreadyCanceledDialogOpened(false)}
      >
        <DialogTitle>Subscription already canceled</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your subscription has been already canceled, your card won't be
            charged again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsSubscriptionAlreadyCanceledDialogOpened(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isMembershipDialogOpened} onCancel={closeMembershipDialog}>
        <DialogTitle>Premium member</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are a premium member, invoice period ends at:
            <br />
            {subscriptionEndDateLocal
              ? subscriptionEndDateLocal.format("DD-MM-YYYY HH:mm")
              : "N/A"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeMembershipDialog}>Close</Button>
          <Button onClick={cancelSubscription}>Cancel Subscription</Button>
        </DialogActions>
      </Dialog>

      {/* Next dialog to confirm that subscription cancellation was succesfull */}

      <Dialog
        open={isSubscriptionCanceledDialogOpened}
        onCancel={closeSubscriptionCanceledDialog}
      >
        <DialogContent>
          <DialogContentText>
            {subscriptionCanceledDialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSubscriptionCanceledDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NavMenu;
