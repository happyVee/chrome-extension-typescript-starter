import { Message } from './types';

let countdownElement: HTMLDivElement | null = null;
let countdownInterval: NodeJS.Timeout | null = null;

// 创建倒计时元素
function createCountdownElement() {
  countdownElement = document.createElement('div');
  countdownElement.style.position = 'fixed';
  countdownElement.style.top = '20px';
  countdownElement.style.right = '20px';
  countdownElement.style.backgroundColor = 'rgba(0,0,0,0.9)';
  countdownElement.style.color = 'red';
  countdownElement.style.padding = '10px';
  countdownElement.style.borderRadius = '5px';
  countdownElement.style.zIndex = '9999';
  document.body.appendChild(countdownElement);
}

// 开始倒计时
function startCountdown(seconds: number) {
  if (!countdownElement) {
    createCountdownElement();
  }
  if (countdownElement == null) {
    return
  }
  countdownElement.textContent = `${seconds}秒后刷新`;
  countdownInterval = setInterval(() => {
    seconds--;
    if (seconds >= 0) {
      countdownElement!.textContent = `${seconds}秒后刷新`;
    } else {
      clearInterval(countdownInterval!);
      countdownElement!.remove();
      countdownElement = null;
    }
  }, 1000);
}

// 清除倒计时
function clearCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  if (countdownElement) {
    countdownElement.remove();
    countdownElement = null;
  }
}

// 监听来自background的消息
chrome.runtime.onMessage.addListener((request: Message, sender, sendResponse) => {
  console.log(request)
  if (request.action === 'startCountdown') {
    clearCountdown(); // 清除旧的倒计时
    startCountdown(request.time); // 开始新的倒计时
  } else if (request.action === 'stopCountdown') {
    clearCountdown(); // 清除倒计时
  }
});
