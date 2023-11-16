import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "reactstrap";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Button } from "@mui/material";
import styles from "./AboutComponent.module.css";
import { useAuth } from "../Account/AuthContext";
import DOMPurify from "dompurify";

const AboutComponent = () => {
  const { userRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [aboutContent, setAboutContent] = useState("");

  useEffect(() => {
    async function fetchAboutData() {
      const apiResponse = await fetch(
        `https://${process.env.REACT_APP_API_ADDRESS}/About`
      );
      const aboutResponseJson = await apiResponse.json();
      const sanitizedHTML = DOMPurify.sanitize(aboutResponseJson.innerHTML); // Replace 'yourHtmlField' with your actual JSON field
      setAboutContent(sanitizedHTML);
    }
    fetchAboutData();
  }, []);

  const editButton = () => {
    if (isAuthenticated && (userRole === "ADMIN" || userRole === "admin")) {
      return (
        <>
          <Button
            className={styles.editButton}
            onClick={() => {
              navigate("/aboutEditor");
            }}
          >
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
          {aboutContent ? (
            <div
              style={{ margin: "1%" }}
              dangerouslySetInnerHTML={{ __html: aboutContent }}
            />
          ) : (
            <>
              <h4>Here's the about page,</h4>
              <p style={{ textAlign: "center" }}>
                Login using admin account to add here some brief explanation of
                your content for new viewers.
              </p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AboutComponent;
