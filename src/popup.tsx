import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { Message } from './types';

const Popup = () => {
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log(tabs);
      setTabId(tabs[0].id);
    });
  }, []);

  const intervalRef = useRef<number>(0); // 创建一个引用对象
  const [tabId, setTabId] = useState<number>();
  const [inputHourValue, setInputHourValue] = useState<number>(0);
  const [inputMinuteValue, setInputMinuteValue] = useState<number>(0);
  const [inputSecValue, setInputSecValue] = useState<number>(10);
  const [imputDynamicLimit, setImputDynamicLimit] = useState<number>(3);
  const [isRefreshLimit, setIsRefreshLimit] = useState(false);
  const [showVisualTimer, setShowVisualTimer] = useState(true);

  function handleRadioChange(e: ChangeEvent<HTMLInputElement>) {
    console.log("handleRadioChange", e.target.value )
    const totalSeconds = Number(e.target.value) / 1000; // Convert milliseconds to seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    const seconds = totalSeconds - (hours * 3600) - (minutes * 60);
  
    setInputHourValue(hours);
    setInputMinuteValue(minutes);
    setInputSecValue(seconds);
  }
  

  const startAlarm = () => {
    const newInterval = inputHourValue * 3600 + inputMinuteValue * 60 + inputSecValue;
    intervalRef.current = newInterval; // 更新引用对象的值
    if (tabId) {
      const message: Message = {
        action: "startCountdown",
        time: intervalRef.current,
        tabId: tabId,
        isRefreshLimit,
        showVisualTimer,
        imputDynamicLimit,
        refleshTimes : 0
      };
      console.log(message)
      chrome.runtime.sendMessage(message);
      chrome.tabs.sendMessage(tabId, {action: "stopCountdown"});
      // 向当前标签页发送消息
      if (message.showVisualTimer) {
        chrome.tabs.sendMessage(tabId, message);
      }
    }
  };

  const stopAlarm = () => {
    if (tabId) {
      const message: Message = {
        action: "stopCountdown",
        time: intervalRef.current,
        tabId: tabId,
        isRefreshLimit,
        showVisualTimer,
        imputDynamicLimit,
        refleshTimes : 0
      };
      console.log(message)
      chrome.runtime.sendMessage(message);
      if (message.showVisualTimer) {
        chrome.tabs.sendMessage(tabId, message);
      }
    }
  };

  return (
    <>
      <div className="main-header">
        <div className="logo">
            <div id="ext_title">
                <h3>自动刷新页面</h3>
            </div>
        </div>
        <div className="button-start-stop" id="button-start-stop">
        </div>
    </div>
      <div className="ext-tab">
        <ul className="tabs" style={{display: "none"}}>
          <li className="tab-link current" data-tab="tab-1" id="time_interval">
            <span>当前页面</span>
          </li>
          <li className="tab-link" data-tab="tab-2" id="active_tab">
            <span>所有任务</span>
          </li>
        </ul>

        <div className="tab-content current" id="tab-1">
          <div className="tab-content-list reload-timer">
            <h4>倒计时</h4>
            <div className="reload-time-sec">
              <input type="number" min="0" max="24" name="hour" className="dynamic_time_input" 
                id="timer_hour" value={inputHourValue} onChange={(e) => setInputHourValue(Number(e.target.value))}/>
              <label htmlFor="timer_hour">时</label>
            </div>
            <div className="reload-time-sec icon">
              <input type="number" min="0" max="60" name="minute" className="dynamic_time_input"
                id="time_min" value={inputMinuteValue} onChange={(e) => setInputMinuteValue(Number(e.target.value))}/>
              <label htmlFor="time_min">分</label>
            </div>
            <div className="reload-time-sec">
              <input type="number" min="0" max="60" name="sec" className="dynamic_time_input"
                id="timer_sec" value={inputSecValue} onChange={(e) => setInputSecValue(Number(e.target.value))}/>
              <label htmlFor="timer_sec">秒</label>
            </div>
          </div>
          <div className="tab-content-list ext-presets">
            <h4>预设值</h4>
            <div className="presets">
              <input type="radio" name="reload_opt" id="5_sec" value="5000" onChange={handleRadioChange} />
              <label htmlFor="5_sec">5 秒</label>
            </div>
            <div className="presets">
              <input type="radio" name="reload_opt" id="10_sec" value="10000" onChange={handleRadioChange} />
              <label htmlFor="10_sec">10 秒</label>
            </div>
            <div className="presets">
              <input type="radio" name="reload_opt" id="15_sec" value="15000" onChange={handleRadioChange} />
              <label htmlFor="15_sec">15 秒</label>
            </div>
            <div className="presets">
              <input type="radio" name="reload_opt" id="5_min" value="300000" onChange={handleRadioChange} />
              <label htmlFor="5_min">5 分钟</label>
            </div>
            <div className="presets">
              <input type="radio" name="reload_opt" id="10_min" value="600000" onChange={handleRadioChange} />
              <label htmlFor="10_min">10 分钟</label>
            </div>
            <div className="presets">
              <input type="radio" name="reload_opt" id="15_min" value="900000" onChange={handleRadioChange} />
              <label htmlFor="15_min">15 分钟</label>
            </div>
          </div>
          <div className="tab-content-list ext-options">
            <h4>高级选项</h4>
            <div id="refresh_limit">
              <span className="refresh_limit_container">
                <div className="custom-input">
                  <input type="checkbox" className="custom_refresh_limit" id="custom_refresh"  name="custom_refresh"
                    value="custom_refresh_limit" checked={isRefreshLimit} onChange={(e) => setIsRefreshLimit(Boolean(e.target.checked))}/>
                  <span></span>
                </div>
                <span className="label_for_stop_after">
                  <label className="advance_option" htmlFor="custom_refresh">
                    刷新
                  </label>
                </span>
                <div className="dynamic-section">
                  <input type="number" min="1" max="200" name="dynamic_custom_limit" className="dynamic_custom_limit" 
                    id="dynamic_limit_input" value={imputDynamicLimit} onChange={(e) => setImputDynamicLimit(Number(e.target.value))}/>
                </div>
              </span>
              <span className="label_for_stop_after">
                <label className="advance_option" htmlFor="custom_refresh">
                  次后停止刷新
                </label>
              </span>
            </div>
            <div id="show_visual_timer">
              <div className="custom-input">
                <input type="checkbox" className="show_visual_timer" id="show_visual_timer_check" name="show_visual_timer_check"
                  value="show_visual_timer_check"  checked={showVisualTimer} onChange={(e) => setShowVisualTimer(Boolean(e.target.checked))}/>
                <span></span>
              </div>
              <div className="dynamic-section">
                <label className="advance_option" htmlFor="show_visual_timer_check" >
                  在页面上展示倒计时
                </label>
              </div>
            </div>
          </div>
          <div className="tab-content-list current_manual">
            <h4 className="type_ar"></h4>
            <div className="tabtype">
              <button id="btnSave" className="btn" onClick={startAlarm}>
                开始刷新
              </button>
            </div>
            <div className="tabtype">
              <button id="btnSave" className="btn stop" onClick={stopAlarm}>
                停止刷新
              </button>
            </div>
          </div>
        </div>
        <div className="tab-content" id="tab-2">
          <div className="tab-content-list active-tab-det">
            <h4>刷新任务</h4>
            <div className="url-list" id="url_container"></div>
          </div>
        </div>
      </div>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
