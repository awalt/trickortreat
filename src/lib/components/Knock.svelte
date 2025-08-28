<script>
  import { createEventDispatcher } from 'svelte';
   import { knockSound } from '$lib/audio.js';
    import { onMount, onDestroy } from 'svelte';

  const dispatch = createEventDispatcher();
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  let knocks = [[], [], [], []];
  let isPlaying = false;
  let resultMessage = '';
  let resultMessageType = ''; // 'correct' or 'incorrect'
  let playingCell = null; // Stored as { rowIndex, colIndex }

  const correctPattern = '2121';

  function handleKnock(rowIndex, colIndex) {
    if (isPlaying) return;
    
    // Clear the previous result when the user starts a new input
    if (resultMessage) {
        resultMessage = '';
    }

    // Set the number of knocks for the selected row
    knocks[rowIndex] = Array(colIndex + 1).fill(true);
    // This assignment is crucial to trigger Svelte's reactivity
    knocks = knocks;
  }

 async function handleSubmit() {
    isPlaying = true;
    resultMessage = '';
    const pattern = knocks.map(row => row.length).join('');

    // --- FIX STARTS HERE ---

    // 1. Find the index of the last row that actually has knocks.
    const lastKnockRowIndex = knocks.map(r => r.length > 0).lastIndexOf(true);

    // Play back the entered knocking pattern
    for (const [rowIndex, row] of knocks.entries()) {
        if (row.length > 0) {
            for (let i = 0; i < row.length; i++) {
                await playKnock(rowIndex, i);
                // Fast delay between knocks in the same row
                await sleep(10);
            }

            // 2. Wait if the current row is not the last row with knocks.
            if (rowIndex < lastKnockRowIndex) {
                await sleep(400); // The pause between rows
            }
        }
    }
    
    // --- FIX ENDS HERE ---

    // Check if the pattern is correct
    if (pattern === correctPattern) {
        resultMessage = 'ACCESS GRANTED';
        resultMessageType = 'correct';
    } else {
        resultMessage = 'ACCESS DENIED';
        resultMessageType = 'incorrect';
    }
    
    isPlaying = false;
}

  function playKnock(rowIndex, colIndex) {
    return new Promise(resolve => {
      knockSound.play(); // Uncomment if you have knockSound configured
      playingCell = { rowIndex, colIndex };
      
      // The "playing" animation lasts for 200ms
      setTimeout(() => {
        playingCell = null;
        resolve();
      }, 200);
    });
  }

  function resetPattern() {
      if (isPlaying) return;
      knocks = [[], [], [], []];
      resultMessage = '';
  }
</script>

<main class="bg-gray-900 text-gray-200 min-h-screen flex flex-col items-center justify-center p-4 font-mono">
  <div class="bg-gray-800 border-2 border-gray-700 p-6 md:p-8 rounded-xl shadow-2xl shadow-black/50 text-center w-full max-w-md">
    
    <h1 class="text-3xl md:text-4xl font-bold text-yellow-400 mb-2 uppercase tracking-widest">Secret Knock</h1>
    <p class="text-gray-400 mb-8">Enter the pattern to open the door.</p>

    <div class="flex flex-col gap-3 mb-8">
      {#each { length: 4 } as _, rowIndex}
        <div class="grid grid-cols-4 gap-3">
          {#each { length: 4 } as _, colIndex}
            {@const isHighlighted = knocks[rowIndex]?.[colIndex]}
            {@const isPlayingCell = playingCell?.rowIndex === rowIndex && playingCell?.colIndex === colIndex}
            <div
              on:click={() => handleKnock(rowIndex, colIndex)}
              class="w-full aspect-square flex items-center justify-center border-2 rounded-md transition-all duration-150"
              class:cursor-pointer={!isPlaying}
              class:cursor-not-allowed={isPlaying}
              class:border-gray-600={!isHighlighted && !isPlayingCell}
              class:hover:border-yellow-300={!isPlaying && !isHighlighted}
              class:bg-gray-700={isHighlighted && !isPlayingCell}
              class:border-yellow-400={isHighlighted && !isPlayingCell}
              class:bg-yellow-500={isPlayingCell}
              class:border-yellow-500={isPlayingCell}
              class:scale-110={isPlayingCell}
              class:shadow-lg={isPlayingCell}
              class:shadow-yellow-500={isPlayingCell}
            >
              <span class="text-3xl select-none">✊</span>
            </div>
          {/each}
        </div>
      {/each}
    </div>

    <div class="flex items-center justify-center gap-4">
        <button
          on:click={resetPattern}
          disabled={isPlaying}
          class="px-6 py-3 bg-gray-600 text-gray-200 font-bold rounded-lg uppercase tracking-wider hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Reset
        </button>
        <button
          on:click={handleSubmit}
          disabled={isPlaying}
          class="px-8 py-3 bg-yellow-600 text-gray-900 font-bold rounded-lg uppercase tracking-wider hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Submit
        </button>
    </div>

    <div class="mt-6 h-8 flex items-center justify-center">
        {#if resultMessage}
        <div class="text-2xl font-bold tracking-widest animate-pulse"
             class:text-green-400={resultMessageType === 'correct'}
             class:text-red-500={resultMessageType === 'incorrect'}
        >
          {resultMessage}
        </div>
      {/if}
    </div>
  </div>
</main>