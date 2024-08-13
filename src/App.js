import React, { useState, useEffect } from "react";
import ZodiacList from "./ZodiacList/ZodiacList";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const userLang = navigator.language || navigator.userLanguage;
    if (userLang.startsWith("en")) {
      setLanguage("en");
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "en" ? "ru" : "en"));
  };

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.setHeaderColor("#ff0000");
      console.log("Telegram Web App API доступен");
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{language === "ru" ? "Гороскоп" : "Horoscope"}</h1>
        <button onClick={toggleLanguage}>
          {language === "ru" ? "Switch to English" : "Переключить на русский"}
        </button>
      </header>
      <ZodiacList language={language} />
    </div>
  );
}

export default App;
