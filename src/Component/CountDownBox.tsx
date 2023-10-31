import React, { useEffect, useState } from "react";

const CountDownBox = () => {
  const [isCounting, setIsCounting] = React.useState(false);

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    debugger
    console.log("CountDownBox", request);
    if (request.action == 'startCountdown') {
      setIsCounting(true);
    } else if (request.action == 'stopCountdown') {
      setIsCounting(false);
    }
  });

  return (
    <div>
      {/* {isCounting ? <text>count down now </text> : null} */}
      <div>count down now </div>
    </div>
  );
};

export default CountDownBox;