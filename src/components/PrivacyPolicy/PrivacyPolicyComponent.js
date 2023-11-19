import { useEffect, useState } from "react";
import { useAuth } from "../Account/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { Card } from "reactstrap";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DOMPurify from "dompurify";
import styles from "./PrivacyPolicyComponent.module.css";

const PrivacyPolicyComponent = () => {
  const [privacyPolicyHtml, setPrivacyPolicyHtml] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { userRole, isAuthenticated } = useAuth();
  useEffect(() => {
    fetchData();
  }, [userRole, isAuthenticated]);
  const navigate = useNavigate();

  async function fetchData() {
    setIsLoading(true);
    const apiResponse = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/regulations/privacyPolicy`
    );
    if (apiResponse.ok && apiResponse.status === 200) {
      var jsonRes = await apiResponse.json();
      const sanitizedHTML = DOMPurify.sanitize(jsonRes.HtmlContent);
      setPrivacyPolicyHtml(sanitizedHTML);
    } else if (apiResponse.status === 204) {
      setPrivacyPolicyHtml(undefined);
    } else {
      console.error("Unexpected error occured, contact vendor");
    }
    setIsLoading(false);
  }

  const overlay = () => {
    if (isAuthenticated && (userRole === "ADMIN" || userRole === "admin")) {
      return <div className={styles.overlay}></div>;
    }
  };

  const editButton = () => {
    if (isAuthenticated && (userRole === "ADMIN" || userRole === "admin")) {
      return (
        <>
          <Button
            className={styles.editButton}
            onClick={() => {
              navigate("/privacyPolicyEditor");
            }}
          >
            <BorderColorIcon className={styles.editButtonIcon} />
          </Button>
        </>
      );
    }
  };
  return (
    <div className={styles.boxShadowCard}>
      {isLoading ? (
        <div className={styles.container}>
          <CircularProgress />
        </div>
      ) : (
        <Card className={styles.boxShadowCard}>
          {editButton()}
          <div>
            {overlay()}
            {privacyPolicyHtml ? (
              <div
                style={{ margin: "1%" }}
                dangerouslySetInnerHTML={{ __html: privacyPolicyHtml }}
              />
            ) : (
              <>
                <div style={{ textAlign: "center" }}>
                  <h4>Polityka prywatności</h4>
                  <p>
                    Zaloguj się przy użyciu konta administratora aby dodać
                    politykę prywatności portalu.
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PrivacyPolicyComponent;
