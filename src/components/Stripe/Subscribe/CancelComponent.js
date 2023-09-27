import { Link } from "react-router-dom";

const CancelComponent = () => {
  return (
    <div style={{ textAlign: "center", marginBlock: "3vmax" }}>
      <h4>No payment submitted</h4>
      <Link to="../films-list">Return to films list</Link>
    </div>
  );
};

export default CancelComponent;
