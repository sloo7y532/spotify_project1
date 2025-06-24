import "./App.css";
import React, { useEffect } from "react";
import AppRoutes from "./routes/index.tsx";
import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set document direction based on language
    const direction = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;

    // Add direction class to body for CSS styling
    document.body.className = document.body.className
      .replace(/\b(rtl|ltr)\b/g, "")
      .trim();
    document.body.classList.add(direction);
  }, [i18n.language]);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const direction = lng === "ar" ? "rtl" : "ltr";
      document.documentElement.dir = direction;
      document.documentElement.lang = lng;

      // Update body class
      document.body.className = document.body.className
        .replace(/\b(rtl|ltr)\b/g, "")
        .trim();
      document.body.classList.add(direction);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
