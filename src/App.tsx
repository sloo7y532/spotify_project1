
import "./App.css";
import React from "react";
import AppRoutes from "./routes/index.tsx";
import { BrowserRouter } from "react-router-dom";

function App() {
  <link href="https://api.fontshare.com/v2/css?f[]=kalam@400&f[]=chillax@600&f[]=tanker@400&f[]=teko@600&display=swap" rel="stylesheet"></link>
  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;