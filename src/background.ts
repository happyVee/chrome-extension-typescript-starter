console.log("installed")

chrome.runtime.onInstalled.addListener((): void => {
  try {
    console.log("installed")
    chrome.alarms.create({periodInMinutes: 1});
  } catch (error) {
    console.error("Error in onInstalled event: ", error);
  }
});

chrome.alarms.onAlarm.addListener((): void => {
  try {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs: chrome.tabs.Tab[]): void => {
      console.log(tabs)
      if (tabs.length > 0) {
        const tab = tabs[0];
        if (tab.id !== undefined) {
          chrome.tabs.reload(tab.id);
        }
      }
    });
  } catch (error) {
    console.error("Error in onAlarm event: ", error);
  }
});