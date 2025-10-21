// trickortreat/src/lib/timerStore.js
import { readable } from "svelte/store";

/**
 * Reads the current game time from localStorage. This is the single source
 * of truth for what time should be displayed. It handles all states:
 * running, stopped, and not yet started.
 * @returns {number} The elapsed time in seconds.
 */
function getElapsedTime() {
  // Guard against running on the server during SSR.
  if (typeof window === "undefined") {
    return 0;
  }

  const startTime = localStorage.getItem("gameStartTime");
  const isRunning = localStorage.getItem("isGameTimerRunning") !== "false";
  const finalTime = localStorage.getItem("gameFinalTime");

  // If the timer has never started, show 0.
  if (!startTime) {
    return 0;
  }

  // If the timer is actively running, calculate the current elapsed time.
  if (isRunning) {
    return Math.floor((Date.now() - parseInt(startTime, 10)) / 1000);
  } else {
    // If the timer is stopped, show its final stored value.
    // Default to 0 if for some reason a final time isn't stored.
    return finalTime ? parseInt(finalTime, 10) : 0;
  }
}

/**
 * A readable Svelte store that provides the current game time in seconds.
 * It automatically updates every second by polling localStorage, making it
 * extremely resilient to component lifecycles, page navigations, or
 * performance issues like a blocked main thread.
 */
export const time = readable(
  getElapsedTime(), // Set the initial value on creation
  (set) => {
    // This function runs when the first subscriber subscribes.
    const interval = setInterval(() => {
      set(getElapsedTime());
    }, 1000);

    // This function runs when the last subscriber unsubscribes.
    return () => {
      clearInterval(interval);
    };
  },
);
