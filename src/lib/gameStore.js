 import { writable } from 'svelte/store';

  // Default state for a new game
  const defaultState = {
    currentView: 'intro', // Can be 'intro', 'puzzle1', 'conclusion'
    puzzle1Solved: false,
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
      // Action to start the game
      startGame: () => update(state => ({ ...state, currentView: 'puzzle1' })),
      
      // Action to solve a puzzle
      solvePuzzle: (puzzleId) => {
        update(state => {
          const newState = { ...state };
          if (puzzleId === 'puzzle1') {
            newState.puzzle1Solved = true;
            // For now, solving puzzle 1 goes straight to the conclusion
            newState.currentView = 'conclusion'; 
          }
          // Add more puzzles here with `else if`
          return newState;
        });
      },

      // Action to reset the game
      reset: () => {
        set(defaultState);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('escapeGameState');
        }
      }
    };
  }

  export const gameStore = createGameStore();