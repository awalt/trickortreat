// trickortreat/src/lib/gameStore.js
import { writable } from "svelte/store";

const defaultState = {
  currentView: "Splash",
  introVideoReady: false,
  lastSolvedPuzzle: null,
};

// This is the master list of the puzzle order.
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

  // On initial load, restore the previous session or start a new one.
  if (typeof window !== "undefined") {
    setTimeout(() => {
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        set(parsedState);
      } else {
        update((state) => ({ ...state, currentView: "Intro" }));
      }
    }, 500); // Show splash for 0.5 seconds
  }

  // Persist the game state to localStorage whenever it changes.
  subscribe((value) => {
    if (typeof window !== "undefined" && value.currentView !== "Splash") {
      localStorage.setItem("escapeGameState", JSON.stringify(value));
    }
  });

  return {
    subscribe,
    startGame: () => {
      if (typeof window !== "undefined") {
        // --- REMOVE TIMER LOGIC FROM HERE ---
        // localStorage.setItem("gameStartTime", Date.now().toString());
        // localStorage.setItem("isGameTimerRunning", "true");
        // localStorage.removeItem("gameFinalTime");
        // --- END REMOVAL ---
      }
      update((state) => ({ ...state, currentView: "DoorScene" }));
    },
    finishWalking: () => {
      // --- ADD TIMER LOGIC HERE ---
      if (typeof window !== "undefined") {
        // Set the start time and flag the timer as running.
        localStorage.setItem("gameStartTime", Date.now().toString());
        localStorage.setItem("isGameTimerRunning", "true");
        // Ensure any old final time is cleared for the new run.
        localStorage.removeItem("gameFinalTime");
      }
      // --- END ADDITION ---
      update((state) => ({ ...state, currentView: "Door" }));
    },
    setIntroVideoReady: () =>
      update((state) => ({ ...state, introVideoReady: true })),
    solvePuzzle: () => {
      update((state) => {
        const currentIndex = gamePagesOrder.indexOf(state.currentView);
        const nextView = gamePagesOrder[currentIndex + 1] || "Conclusion";

        // If the user has reached the end, stop the timer.
        if (nextView === "Conclusion" && typeof window !== "undefined") {
          const startTime = localStorage.getItem("gameStartTime");
          if (startTime) {
            const finalTime = Math.floor(
              (Date.now() - parseInt(startTime, 10)) / 1000,
            );
            localStorage.setItem("gameFinalTime", finalTime.toString());
          }
          localStorage.setItem("isGameTimerRunning", "false");
        }

        return {
          ...state,
          lastSolvedPuzzle: state.currentView,
          currentView: nextView,
        };
      });
    },
    reset: () => {
      if (typeof window !== "undefined") {
        // Clear all game-related localStorage items to start fresh.
        localStorage.removeItem("escapeGameState");
        localStorage.removeItem("gameStartTime");
        localStorage.removeItem("gameFinalTime");
        localStorage.removeItem("isGameTimerRunning");
      }
      // Reset the store to its default state, starting at the Intro page.
      set({ ...defaultState, currentView: "Intro" });
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
