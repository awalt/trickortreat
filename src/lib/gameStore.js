import { writable } from 'svelte/store';

const defaultState = {
  currentView: 'Splash',
  introVideoReady: false,
  lastSolvedPuzzle: null,
};

//USE THIS AS THE MASTER LIST OF THE PUZZLE ORDER. ALSO USE THIS FOR THE DebugMenu SHORTCUTS (automatically)
export const gamePagesOrder = [
    "Splash",
    "Intro", 
    "DoorScene",
    "VideoTransition",
    "Door",
    "Bug",
    "Knock",
    "Candy",
    "Conclusion"
]

function createGameStore() {
  const savedState = typeof window !== 'undefined' ? localStorage.getItem('escapeGameState') : null;

  const initialState = { ...defaultState, currentView: 'Splash' };

  const { subscribe, set, update } = writable(initialState);

  // On initial load, decide where to send the user after a brief splash screen.
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // If user has progress, jump them to the correct puzzle
        if (parsedState.lastSolvedPuzzle) {
            const lastPuzzleIndex = gamePagesOrder.indexOf(parsedState.lastSolvedPuzzle);
            if (lastPuzzleIndex > -1 && lastPuzzleIndex + 1 < gamePagesOrder.length) {
                const nextView = gamePagesOrder[lastPuzzleIndex + 1];
                set({ ...parsedState, currentView: nextView, introVideoReady: true });
                return;
            }
        }
      }
      // Otherwise, go to the intro
      update(state => ({ ...state, currentView: 'Intro' }));
    }, 500); // Show splash for 0.5 seconds
  }

  // Persist game state to localStorage
  subscribe(value => {
    if (typeof window !== 'undefined' && value.currentView !== 'Splash') {
      localStorage.setItem('escapeGameState', JSON.stringify(value));
    }
  });

  return {
    subscribe,
    startGame: () => update(state => ({ ...state, currentView: 'DoorScene' })),
    finishWalking: () => update(state => ({ ...state, currentView: 'Door' })),
    setIntroVideoReady: () => update(state => ({ ...state, introVideoReady: true })),
    solvePuzzle: () => {
        update(state => {
            const currentIndex = gamePagesOrder.indexOf(state.currentView);
            const nextView = gamePagesOrder[currentIndex + 1] || 'Conclusion';
            return { ...state, lastSolvedPuzzle: state.currentView, currentView: nextView };
        });
    },
    reset: () => {
      set(defaultState);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('escapeGameState');
        update(state => ({...defaultState, currentView: 'Intro', introVideoReady: false}));
      }
    },
    goToView: (view) => update(state => ({ ...state, currentView: view })),
     goToPage: (pageName) => update(state => {
        const targetIndex = gamePagesOrder.indexOf(pageName);
        
        // If the page name is not in the order, do nothing and log a warning.
        if (targetIndex === -1) {
            console.warn(`Cannot go to page "${pageName}": not found in gamePagesOrder.`);
            return state;
        }

        // The last solved puzzle should be the page just before the one we are navigating to.
        // If we navigate to the first or second item (Splash/Intro), there is no "solved" puzzle yet.
        const newLastSolvedPuzzle = targetIndex > 1 ? gamePagesOrder[targetIndex - 1] : null;

        // Update the state with the new view and the correct last solved puzzle to maintain progress.
        return { ...state, currentView: pageName, lastSolvedPuzzle: newLastSolvedPuzzle };
    })
  };
}

export const gameStore = createGameStore();