import React, { useEffect, useState } from "react";

const CountDownBox = () => {
  const [isCounting, setIsCounting] = React.useState(false);

  useEffect(() => {
    console.log("CountDownBox useEffect run");
    const messageListener = (request: any, sender: chrome.runtime.MessageSender, sendResponse: any) => {
      console.log("CountDownBox", request);
      if (request.action == 'startCountdown') {
        setIsCounting(true);
      } else if (request.action == 'stopCountdown') {
        setIsCounting(false);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // // 清除函数
    // return () => {
    //   chrome.runtime.onMessage.removeListener(messageListener);
    // };
  }, []); // 空的依赖数组表示这个 useEffect 只在组件挂载和卸载时运行

  return (
    <div>
      {!isCounting ? <div>count down now </div> : null}
    </div>
  );
};

export default CountDownBox;
