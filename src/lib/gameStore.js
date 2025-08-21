import { writable } from 'svelte/store';

// Default state for a new game
const defaultState = {
  currentView: 'intro', // Can be 'intro', 'walking', 'puzzle1', 'puzzle2', 'conclusion'
  puzzle1Solved: false,
  puzzle2Solved: false,
};

// Function to create our custom store
function createGameStore() {
  // Check localStorage for saved data, or use the default state
  const savedState = typeof window !== 'undefined' ? localStorage.getItem('escapeGameState') : null;
  const initialState = savedState ? JSON.parse(savedState) : defaultState;

  const { subscribe, set, update } = writable(initialState);

  // Whenever the store changes, save it to localStorage
  subscribe(value => {
    if (typeof window !== 'undefined') {
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
      }
    },
		
    goToView: (view) => update(state => ({ ...state, currentView: view }))
  };
}

export const gameStore = createGameStore();