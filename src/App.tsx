import "./App.css";
import React from "react";
import AppRoutes from "./routes/index.tsx";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    
    <div className="App">
      <link href="https://api.fontshare.com/v2/css?f[]=kalam@400&f[]=chillax@600&f[]=tanker@400&f[]=teko@600&display=swap" rel="stylesheet"></link>
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;
