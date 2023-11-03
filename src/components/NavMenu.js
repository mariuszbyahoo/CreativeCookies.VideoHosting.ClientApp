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
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
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
import { useTranslation } from "react-i18next";
import i18n from "i18next";

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

  const [language, setLanguage] = useState("pl"); // Default language

  const changeLanguage = (event) => {
    let newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const { t } = useTranslation();

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
        setSubscriptionCanceledDialogMsg(t("SubscriptionCanceledSuccessfully"));
        setIsSubscriptionCanceledDialogOpened(true);
      } else if (res.status === 402) {
        setIsSubscriptionAlreadyCanceledDialogOpened(true);
      } else {
        setSubscriptionCanceledDialogMsg(t("ErrorCancellingSubscription"));
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
            <Button onClick={() => openMembershipDialog()}>
              {t("Premium")}
              <SettingsRounded style={{ color: "black" }} />
            </Button>
          </NavItem>
        </>
      );
  };

  const handleNonSubscriberPaymentNav = () => {
    subscriptionStartDateLocal &&
      setConfirmationDialogMsg(
        <>
          {t("NonSubscriberPaymentNavTxt1")}:{" "}
          {subscriptionStartDateLocal.format("DD.MM.YYYY")},{" "}
          {t("NonSubscriberPaymentNavTxt2")}.
          <br />
          {t("ForMoreInfoVisit")}:
          <br />
          <a
            href="https://europa.eu/youreurope/citizens/consumers/shopping/guarantees-returns/index_en.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("EUWebsite")}
          </a>
        </>
      );
    if (isAwaitingForSubscription) {
      subscriptionStartDateLocal &&
        setPaymentNavContent(
          <>
            <NavItem>
              {t("AwaitingAccess")}
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
            <Link to="/subscribe">{t("Subscribe")}</Link>
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
              {t("FilmUpload")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} className="text-dark" to="/users-list">
              {t("UsersList")}
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
          {/* <NavItem style={{ marginInline: "1em" }}>
            <FormControl
              className="language-select"
              style={{ minWidth: 120, margin: "auto 0" }}
            >
              <InputLabel
                id="language-selector-label"
                style={{ lineHeight: "1em" }}
              >
                {t("Language")}
              </InputLabel>
              <Select
                labelId="language-selector-label"
                id="language-selector"
                label={t("Language")}
                value={language}
                onChange={changeLanguage}
                style={{
                  height: "2em",
                  paddingTop: "1px",
                  paddingBottom: "1px",
                }}
                MenuProps={{
                  style: {
                    maxHeight: 300,
                  },
                }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="pl">Polski</MenuItem>
              </Select>
            </FormControl>
          </NavItem> */}
          <NavbarToggler onClick={toggleNavbar} className="mr-2" />
          <Collapse
            className="d-sm-inline-flex flex-sm-row-reverse"
            isOpen={!collapsed}
            navbar
          >
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">
                  {t("About")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/films-list">
                  {t("Films")}
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
        <DialogTitle>{t("OrderCanceled")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("RefundInitiatedMsg")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCoolingOffPeriodMessageDialog}>
            {t("Close")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isSubscriptionAlreadyCanceledDialogOpened}
        onCancel={() => setIsSubscriptionAlreadyCanceledDialogOpened(false)}
      >
        <DialogTitle>{t("SubscriptionAlreadyCanceled")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("SubscriptionAlreadyCanceledMsg")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsSubscriptionAlreadyCanceledDialogOpened(false)}
          >
            {t("Close")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isMembershipDialogOpened} onCancel={closeMembershipDialog}>
        <DialogTitle>{t("Premium")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("BillingPeriodTillMsg")}:
            <br />
            {subscriptionEndDateLocal
              ? subscriptionEndDateLocal.format("DD-MM-YYYY HH:mm")
              : "N/A"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeMembershipDialog}>{t("CloseWindow")}</Button>
          <Button onClick={cancelSubscription}>
            {t("CancelSubscription")}
          </Button>
        </DialogActions>
      </Dialog>
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
          <Button onClick={closeSubscriptionCanceledDialog}>
            {t("Close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NavMenu;
