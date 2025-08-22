import { writable } from 'svelte/store';

// A new store to track video loading
export const videoLoaded = writable(false);

const defaultState = {
  currentView: 'intro', 
  puzzle1Solved: false,
  puzzle2Solved: false,
};

function createGameStore() {
  const savedState = typeof window !== 'undefined' ? localStorage.getItem('escapeGameState') : null;

  const initialState = { ...defaultState, currentView: 'splash' };

  const { subscribe, set, update } = writable(initialState);

  if (typeof window !== 'undefined') {
    // We'll now use the videoLoaded store to decide when to transition
    const unsubscribe = videoLoaded.subscribe(loaded => {
      if (loaded) {
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          if (parsedState.puzzle1Solved || parsedState.puzzle2Solved) {
            set(parsedState);
          } else {
            update(state => ({ ...state, currentView: 'intro' }));
          }
        } else {
          update(state => ({ ...state, currentView: 'intro' }));
        }
        unsubscribe(); // Unsubscribe after the transition
      }
    });
  }

  subscribe(value => {
    if (typeof window !== 'undefined' && value.currentView !== 'splash') {
      localStorage.setItem('escapeGameState', JSON.stringify(value));
    }
  });

  return {
    subscribe,
    startGame: () => update(state => ({ ...state, currentView: 'walking' })),
    finishWalking: () => update(state => ({ ...state, currentView: 'puzzle1' })),
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
        update(state => ({...defaultState, currentView: 'intro'}));
      }
    },
    goToView: (view) => update(state => ({ ...state, currentView: view }))
  };
}

export const gameStore = createGameStore();