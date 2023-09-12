import { Button } from "@mui/material";
import { useAuth } from "../../Account/AuthContext";
import styles from "./SubscribeComponent.module.css";
import { ArrowForwardIos, HowToReg } from "@mui/icons-material";
import ShopIcon from "@mui/icons-material/Shop";

const SubscribeComponent = () => {
  const { isAuthenticated } = useAuth();

  const getActionButton = () => {
    return isAuthenticated ? (
      <Button variant="outlined">
        <ShopIcon /> Subscribe
      </Button>
    ) : (
      <Button variant="outlined">
        <HowToReg /> Register
      </Button>
    );
  };

  return (
    <>
      <div className={styles.container}>
        <h3>Subscribe</h3>
        <p className={styles.container}>
          <ArrowForwardIos />
          Benefit 1
        </p>
        <p className={styles.container}>
          <ArrowForwardIos />
          Benefit 2
        </p>
        <p className={styles.container}>
          <ArrowForwardIos />
          Benefit 3
        </p>
        <p className={styles.container}>
          <ArrowForwardIos />
          Benefit 4
        </p>
        <p className={styles.container}></p>
        {getActionButton()}
      </div>
    </>
  );
};
export default SubscribeComponent;
