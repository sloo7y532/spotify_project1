import React from "react";
import "../styles/Spinner.css";

const Spinner: React.FC = () => (
  <div className="spinner" role="status" aria-live="polite">
    <div className="spinner-circle"></div>
    <span className="visually-hidden">Loading...</span>
  </div>
);

export default Spinner;
