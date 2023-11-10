type Action = "startCountdown" | "stopCountdown" | "cleanAll";

export interface Message {
    action: Action;
    time: number;
    tabId: number;
    isRefreshLimit: boolean;
    showVisualTimer: boolean;
    imputDynamicLimit: number;
    refleshTimes: number | null;
}