import "./App.css";
import React from "react";
import AppRoutes from "./routes/index.tsx";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    
    <div className="App">
<<<<<<< HEAD
      <link href="https://api.fontshare.com/v2/css?f[]=kalam@400&f[]=chillax@600&f[]=tanker@400&f[]=teko@600&display=swap" rel="stylesheet"></link>
      <Router>
=======
      <BrowserRouter>
>>>>>>> ad65bf294454bc187692d4c00cdba9d94d14fbcd
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
