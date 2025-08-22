// src/lib/gameStore.js
import { writable } from 'svelte/store';

// Default state for a new game
const defaultState = {
  currentView: 'intro', // Can be 'intro', 'walking', 'puzzle1', 'puzzle2', 'conclusion'
  puzzle1Solved: false,
  puzzle2Solved: false,
};

// Function to create our custom store
function createGameStore() {
  const savedState = typeof window !== 'undefined' ? localStorage.getItem('escapeGameState') : null;

  // Start with the splash screen
  const initialState = { ...defaultState, currentView: 'splash' };

  const { subscribe, set, update } = writable(initialState);

  // After the store is created, check for saved state and navigate
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // If there's progress, go to the last view, otherwise intro
        if (parsedState.puzzle1Solved || parsedState.puzzle2Solved) {
            set(parsedState); // Restore the entire state
        } else {
            update(state => ({ ...state, currentView: 'intro' }));
        }
      } else {
        update(state => ({ ...state, currentView: 'intro' }));
      }
    }, 1500); // Show splash for 1.5 seconds
  }


  // Whenever the store changes, save it to localStorage
  subscribe(value => {
    if (typeof window !== 'undefined' && value.currentView !== 'splash') {
      localStorage.setItem('escapeGameState', JSON.stringify(value));
    }
  });

  return {
    subscribe,
    // Action to start the game - NOW GOES TO 'walking'
    startGame: () => update(state => ({ ...state, currentView: 'walking' })),

    // NEW action to be called when the video ends
    finishWalking: () => update(state => ({ ...state, currentView: 'puzzle1' })),

    // Action to solve a puzzle
    solvePuzzle: (puzzleId) => {
      update(state => {
        const newState = { ...state };
        if (puzzleId === 'puzzle1') {
          newState.puzzle1Solved = true;
          newState.currentView = 'puzzle2';
        } else if (puzzleId === 'puzzle2') {
          newState.puzzle2Solved = true;
          newState.currentView = 'conclusion';
        }
        return newState;
      });
    },

    // Action to reset the game
    reset: () => {
      set(defaultState);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('escapeGameState');
        // After resetting, we should go to the intro
        update(state => ({...defaultState, currentView: 'intro'}));
      }
    },

    goToView: (view) => update(state => ({ ...state, currentView: view }))
  };
}

export const gameStore = createGameStore();