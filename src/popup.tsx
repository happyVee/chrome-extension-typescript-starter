import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const Popup = () => {
  const [interval, setInterval] = useState<number>(1);
  const [currentURL, setCurrentURL] = useState<string>();

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const startAlarm = () => {
    console.log("startAlarm")
    // Convert the input interval from seconds to minutes required by the API
    const periodInMinutes = interval / 60;
    chrome.alarms.create({ periodInMinutes });
  };

  const stopAlarm = () => {
    console.log("stopAlarm")
    chrome.alarms.clearAll();
  };

  return (
    <>
      <h1>Auto Refresh</h1>
      <p>Set interval (in seconds):</p>
      <input 
        id="interval" 
        type="number" 
        min="1" 
        value={interval} 
        onChange={(e) => setInterval(Number(e.target.value))}
      />
      <button id="start" onClick={startAlarm}>Start</button>
      <button id="stop" onClick={stopAlarm}>Stop</button>
      <ul style={{ minWidth: "700px" }}>
        <li>Current URL: {currentURL}</li>
        <li>Current Time: {new Date().toLocaleTimeString()}</li>
      </ul>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
