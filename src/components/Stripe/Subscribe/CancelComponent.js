import { Link } from "react-router-dom";

const CancelComponent = () => {
  return (
    <div style={{ textAlign: "center", marginBlock: "3vmax" }}>
      <h4>{t("NoPaymentSubmitted")}</h4>
      <Link to="../films-list">{t("ReturnToFilmsList")}</Link>
    </div>
  );
};

export default CancelComponent;
