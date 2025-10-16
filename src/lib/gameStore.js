// This file is: gameStore.js
import { writable } from "svelte/store";

const defaultState = {
  currentView: "Splash",
  introVideoReady: false,
  lastSolvedPuzzle: null,
};

// USE THIS AS THE MASTER LIST OF THE PUZZLE ORDER. ALSO USE THIS FOR THE DebugMenu SHORTCUTS (automatically)
export const gamePagesOrder = [
  "Splash",
  "Intro",
  "DoorScene",
  "VideoTransition",
  "Door",
  "Bug",
  "Knock",
  "Candy",
  "Conclusion",
];

function createGameStore() {
  const savedState =
    typeof window !== "undefined"
      ? localStorage.getItem("escapeGameState")
      : null;

  const initialState = { ...defaultState, currentView: "Splash" };

  const { subscribe, set, update } = writable(initialState);

  // MODIFIED SECTION: On initial load, restore the previous session or start a new one.
  if (typeof window !== "undefined") {
    setTimeout(() => {
      if (savedState) {
        // If a saved state exists, parse it and set the store to that state.
        // This will restore the user to the exact 'currentView' they were on.
        const parsedState = JSON.parse(savedState);
        set(parsedState);
      } else {
        // Otherwise, if there's no saved state, go to the intro.
        update((state) => ({ ...state, currentView: "Intro" }));
      }
    }, 500); // Show splash for 0.5 seconds
  }

  // Persist game state to localStorage
  subscribe((value) => {
    if (typeof window !== "undefined" && value.currentView !== "Splash") {
      localStorage.setItem("escapeGameState", JSON.stringify(value));
    }
  });

  return {
    subscribe,
    startGame: () =>
      update((state) => ({ ...state, currentView: "DoorScene" })),
    finishWalking: () => update((state) => ({ ...state, currentView: "Door" })),
    setIntroVideoReady: () =>
      update((state) => ({ ...state, introVideoReady: true })),
    stopTimer: () => {
      if (typeof window === "undefined") return;

      const startTime = localStorage.getItem("gameStartTime");
      // Only proceed if the timer was actually started
      if (startTime) {
        const finalTimeInSeconds = Math.floor(
          (Date.now() - parseInt(startTime, 10)) / 1000,
        );
        localStorage.setItem("gameFinalTime", finalTimeInSeconds.toString());
      }
      // Set the running status to false
      localStorage.setItem("isGameTimerRunning", "false");

      // Dispatch an event to let the Timer component know it should update its display
      window.dispatchEvent(new CustomEvent("reset-timer"));
    },
    solvePuzzle: () => {
      update((state) => {
        const currentIndex = gamePagesOrder.indexOf(state.currentView);
        const nextView = gamePagesOrder[currentIndex + 1] || "Conclusion";

        // If the next view is the conclusion, stop the timer.
        if (nextView === "Conclusion") {
          // We need to call the stopTimer method from outside the update function.
          // We'll use a `setTimeout` to ensure it runs after the state update.
          setTimeout(() => gameStore.stopTimer(), 0);
        }

        return {
          ...state,
          lastSolvedPuzzle: state.currentView,
          currentView: nextView,
        };
      });
    },
    reset: () => {
      set(defaultState);
      if (typeof window !== "undefined") {
        localStorage.removeItem("escapeGameState");
        update((state) => ({
          ...defaultState,
          currentView: "Intro",
          introVideoReady: false,
        }));
      }
    },
    goToView: (view) => update((state) => ({ ...state, currentView: view })),
    goToPage: (pageName) =>
      update((state) => {
        const targetIndex = gamePagesOrder.indexOf(pageName);
        if (targetIndex === -1) {
          console.warn(
            `Cannot go to page "${pageName}": not found in gamePagesOrder.`,
          );
          return state;
        }
        const newLastSolvedPuzzle =
          targetIndex > 1 ? gamePagesOrder[targetIndex - 1] : null;
        return {
          ...state,
          currentView: pageName,
          lastSolvedPuzzle: newLastSolvedPuzzle,
        };
      }),
  };
}

export const gameStore = createGameStore();
