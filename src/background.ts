
import { Message } from './types';

console.log("installed")

const tabRefreshIntervals: Map<number, Message> = new Map();

chrome.runtime.onMessage.addListener((request: Message, sender, sendResponse) => {
  console.log("getMessage", request)
  if (request.action === "startCountdown") {
    console.log("startCountdown", request)
    // 首先清除已经存在的定时器
    chrome.alarms.clear(request.tabId.toString(), (wasCleared) => {
      // 然后创建新的定时器
      chrome.alarms.create(request.tabId.toString(), {periodInMinutes: request.time / 60});
    });
    // 将刷新间隔存储在Map中
    tabRefreshIntervals.set(request.tabId, request);
  } else if (request.action === "stopCountdown") {
    // 删除对应的定时器
    chrome.alarms.clear(request.tabId.toString());
    // 从Map中移除刷新间隔
    tabRefreshIntervals.delete(request.tabId);
    chrome.tabs.sendMessage(request.tabId, { action: "stopCountdown"});
  } else if (request.action === "cleanAll") {
    chrome.alarms.clearAll();
     // 清空Map
     tabRefreshIntervals.clear();
  }
});

chrome.runtime.onInstalled.addListener((): void => {
  console.log("installed")
});

chrome.alarms.onAlarm.addListener((alarm): void => {
  console.log("refresh tabId: " + parseInt(alarm.name))
  // 定时器的名字是 tab 的 ID，所以我们可以用它来刷新对应的页面
  chrome.tabs.reload(parseInt(alarm.name))
  .catch(e => {
    console.log(e);
    chrome.alarms.clear(alarm.name);
    tabRefreshIntervals.delete(parseInt(alarm.name));
  });
});

// 当页面刷新时，重新开始倒计时
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tabRefreshIntervals.has(tabId)) {
    console.log(tabRefreshIntervals)
    const message = tabRefreshIntervals.get(tabId);
    if (message?.showVisualTimer) {
      chrome.tabs.sendMessage(tabId, tabRefreshIntervals.get(tabId));
    }

    if (message?.isRefreshLimit) {
      if (!message.refleshTimes) {
        message.refleshTimes = 0;
      }
      message.refleshTimes += 1;
      if (message.refleshTimes >= message.imputDynamicLimit) {
        // 删除对应的定时器
        chrome.alarms.clear(message.tabId.toString());
        // 从Map中移除刷新间隔
        tabRefreshIntervals.delete(message.tabId);
        chrome.tabs.sendMessage(message.tabId, { action: "stopCountdown"});
      }
    }
  }
});