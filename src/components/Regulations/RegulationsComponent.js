import { useEffect, useState } from "react";
import { useAuth } from "../Account/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { Card } from "reactstrap";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DOMPurify from "dompurify";
import styles from "./RegulationsComponent.module.css";

const RegulationsComponent = () => {
  const [regulationsHtml, setRegulationsHtml] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { userRole, isAuthenticated } = useAuth();
  useEffect(() => {
    fetchPlayerData();
  }, [userRole, isAuthenticated]);
  const navigate = useNavigate();

  async function fetchPlayerData() {
    setIsLoading(true);
    const apiResponse = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/regulations/regulations`
    );
    if (apiResponse.ok && apiResponse.status === 200) {
      var jsonRes = await apiResponse.json();
      const sanitizedHTML = DOMPurify.sanitize(jsonRes.HtmlContent);
      setRegulationsHtml(sanitizedHTML);
    } else if (apiResponse.status === 204) {
      setRegulationsHtml(undefined);
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
              navigate("/regulationsEditor");
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
            {regulationsHtml ? (
              <div
                style={{ margin: "1%" }}
                dangerouslySetInnerHTML={{ __html: regulationsHtml }}
              />
            ) : (
              <>
                <div style={{ textAlign: "center" }}>
                  <h4>Regulamin</h4>
                  <p>
                    Zaloguj się przy użyciu konta administratora aby dodać
                    regulamin portalu.
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

export default RegulationsComponent;
