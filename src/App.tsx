import "./App.css";
import React from "react";
import AppRoutes from "./routes/index.tsx";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;