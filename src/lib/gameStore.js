import { writable } from 'svelte/store';

const defaultState = {
  currentView: 'intro', 
  introVideoReady: false,
  puzzle1Solved: false,
  puzzle2Solved: false,
};

function createGameStore() {
  const savedState = typeof window !== 'undefined' ? localStorage.getItem('escapeGameState') : null;

  const initialState = { ...defaultState, currentView: 'splash' };

  const { subscribe, set, update } = writable(initialState);

  // On initial load, decide where to send the user after a brief splash screen.
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // If user has progress, jump them to the correct puzzle
        if (parsedState.puzzle1Solved || parsedState.puzzle2Solved) {
            set({ ...parsedState, introVideoReady: true }); // No need to load intro video
            return;
        }
      }
      // Otherwise, go to the intro
      update(state => ({ ...state, currentView: 'intro' }));
    }, 500); // Show splash for 0.5 seconds
  }

  // Persist game state to localStorage
  subscribe(value => {
    if (typeof window !== 'undefined' && value.currentView !== 'splash') {
      localStorage.setItem('escapeGameState', JSON.stringify(value));
    }
  });

  return {
    subscribe,
    startGame: () => update(state => ({ ...state, currentView: 'doorScene' })),
    finishWalking: () => update(state => ({ ...state, currentView: 'walking' })),
    setIntroVideoReady: () => update(state => ({ ...state, introVideoReady: true })),
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
    reset: () => {
      set(defaultState);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('escapeGameState');
        update(state => ({...defaultState, currentView: 'intro', introVideoReady: false}));
      }
    },
    goToView: (view) => update(state => ({ ...state, currentView: view }))
  };
}

export const gameStore = createGameStore();