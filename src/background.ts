console.log("installed")

chrome.runtime.onMessage.addListener((request: { action: string; time: number; tabId: number}, sender, sendResponse) => {
  if (request.action === "startCountdown") {
    // 首先清除已经存在的定时器
    chrome.alarms.clear(request.tabId.toString(), (wasCleared) => {
      // 然后创建新的定时器
      chrome.alarms.create(request.tabId.toString(), {periodInMinutes: request.time / 60});
    });
  } else if (request.action === "stopCountdown") {
    // 删除对应的定时器
    chrome.alarms.clear(request.tabId.toString());
  }
});

chrome.runtime.onInstalled.addListener((): void => {
  console.log("installed")
});

chrome.alarms.onAlarm.addListener((alarm): void => {
  console.log("refresh tabId: " + parseInt(alarm.name))
  // 定时器的名字是 tab 的 ID，所以我们可以用它来刷新对应的页面
  chrome.tabs.reload(parseInt(alarm.name));
});