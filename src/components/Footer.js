import React from "react";
import styles from "./Footer.module.css"; // Import your CSS module here
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const classNames = `${styles.footer} ${styles.boxShadow}`;
  return (
    <footer className={classNames}>
      {t("YouWantSuchAWebsite")}?
      <a
        href="mailto:mariusz@creativecookies.pl"
        className={styles.linkedin}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("Contact")}
      </a>
      <div className={styles.links}>
        <a href="/privacy-policy">{t("PrivacyPolicy")}</a>
        <a href="/regulations">{t("Regulations")}</a>
      </div>
    </footer>
  );
};

export default Footer;
