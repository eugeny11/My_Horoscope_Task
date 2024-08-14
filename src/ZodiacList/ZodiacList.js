import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import zodiacDataEn from "./zodiacDataEn";
import zodiacDataRu from "./zodiacDataRu";
import "./ZodiacList.css";

const ZodiacList = ({ language }) => {
  const [selectedSign, setSelectedSign] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState(null);
  const [zodiacData, setZodiacData] = useState(
    language === "ru" ? zodiacDataRu : zodiacDataEn
  );

  useEffect(() => {
    setZodiacData(language === "ru" ? zodiacDataRu : zodiacDataEn);
  }, [language]);

  useEffect(() => {
    if (selectedSign) {
      const updatedSign = zodiacData.find(
        (sign) => sign.apiName === selectedSign.apiName
      );
      if (updatedSign) {
        setSelectedSign(updatedSign);
      }
      fetchDescription(selectedSign);
    }
  }, [zodiacData, selectedSign, language]);

  const fetchDescription = (sign) => {
    setIsLoading(true);

    fetch("https://poker247tech.ru/get_horoscope/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sign: sign.apiName,
        language: language === "ru" ? "original" : "translated",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setDescription(data.horoscope || "No description available");
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching description:", error);
        setDescription("Error loading description");
        setIsLoading(false);
      });
  };

  const handleBack = () => {
    setSelectedSign(null);
    setDescription(null);
  };

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      if (selectedSign) {
        handleBack();
      }
    },
  });

  return (
    <div className="zodiac-list" {...swipeHandlers}>
      {!selectedSign ? (
        zodiacData.map((sign) => (
          <div
            key={sign.apiName}
            className="zodiac-item"
            onClick={() => {
              setSelectedSign(sign);
              fetchDescription(sign);
            }}
          >
            <h2>
              {sign.icon} {sign.name}
            </h2>
            <p>{sign.date}</p>
          </div>
        ))
      ) : (
        <div className="zodiac-description">
          <h2>
            {selectedSign.icon} {selectedSign.name}
          </h2>
          {isLoading ? (
            <p>Loading description...</p>
          ) : (
            <p>{description || "No description available"}</p>
          )}
          <button onClick={handleBack}>Back</button>
        </div>
      )}
    </div>
  );
};

export default ZodiacList;
