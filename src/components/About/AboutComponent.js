import React from "react";
import { Link } from "react-router-dom";
import { Card } from "reactstrap";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Button } from "@mui/material";
import styles from "./AboutComponent.module.css";
import { useAuth } from "../Account/AuthContext";

const AboutComponent = () => {
  const { userRole, isAuthenticated } = useAuth();

  const editButton = () => {
    if (isAuthenticated && (userRole === "ADMIN" || userRole === "admin")) {
      return (
        <>
          <Button className={styles.editButton} onClick={() => {}}>
            <BorderColorIcon className={styles.editButtonIcon} />
          </Button>
        </>
      );
    }
  };

  const overlay = () => {
    if (isAuthenticated && (userRole === "ADMIN" || userRole === "admin")) {
      return <div className={styles.overlay}></div>;
    }
  };

  return (
    <div className={styles.boxShadowCard}>
      <Card className={styles.boxShadowCard}>
        {editButton()}
        <div>
          {overlay()}
          <h1>Here's the homepage, a place to insert various stuff inside</h1>
          <h4 style={{ textAlign: "center" }}>
            Click <Link to="/films-list">Here</Link> to explore all films
          </h4>
        </div>
      </Card>
    </div>
  );
};

export default AboutComponent;
