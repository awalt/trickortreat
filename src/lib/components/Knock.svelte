<script>
  import { createEventDispatcher } from 'svelte';
  import { onMount, onDestroy } from 'svelte';
  
  import { knockSound,clickSound, buzzSound } from '$lib/audio.js';

  import JumpScare from '$lib/components/JumpScare.svelte';

  const dispatch = createEventDispatcher();
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  let knocks = [[], [], [], []];
  let isPlaying = false;
  let resultMessage = '';
  let resultMessageType = ''; // 'correct' or 'incorrect'
  let playingCell = null; // Stored as { rowIndex, colIndex }
  let houseFlicker = false; 
  let isFlickerLoopActive = true;
  let isFlickerLoopRunning = false; // NEW: Guard to prevent multiple flicker loops.

  const correctPattern = '2121';

  onMount(()=>{
    console.log("Start flicker. This will give a clue to the user what knocking pattern they need to enter.")
    playHouseFlickerPattern();
  })

  onDestroy(() => {
    isFlickerLoopActive = false;
    buzzSound.stop();
    knockSound.stop();
  });

  function handleKnock(rowIndex, colIndex) {
    if (isPlaying) return;
    if (resultMessage) {
      resultMessage = '';
    }
    knocks[rowIndex] = Array(colIndex + 1).fill(true);
    knocks = knocks;
  }

  async function handleSubmit() {
    isFlickerLoopActive = false; 
    houseFlicker = false;

    isPlaying = true;
    resultMessage = '';
    const pattern = knocks.map(row => row.length).join('');
    const lastKnockRowIndex = knocks.map(r => r.length > 0).lastIndexOf(true);

    for (const [rowIndex, row] of knocks.entries()) {
      if (row.length > 0) {
        for (let i = 0; i < row.length; i++) {
          await playKnock(rowIndex, i);
          await sleep(10);
        }
        if (rowIndex < lastKnockRowIndex) {
          await sleep(400);
        }
      }
    }

    if (pattern === correctPattern) {
      resultMessage = 'ACCESS GRANTED';
      resultMessageType = 'correct';
      // isFlickerLoopActive remains false, stopping the clue permanently.
    } else {
      resultMessage = 'ACCESS DENIED';
      resultMessageType = 'incorrect';
      isFlickerLoopActive = true;
      playHouseFlickerPattern();
    }
    
    isPlaying = false;
  }

  function playKnock(rowIndex, colIndex) {
    return new Promise(resolve => {
      knockSound.play();
      playingCell = { rowIndex, colIndex };
      
      setTimeout(() => {
        playingCell = null;
        resolve();
      }, 200);
    });
  }

  // MODIFIED: Added the guard logic to this function.
  async function playHouseFlickerPattern() {
    // If a flicker loop is already running, do nothing.
    if (isFlickerLoopRunning) return;
    isFlickerLoopRunning = true;

    try {
      const flickerDuration = 100;
      const shortPause = 250;
      const longPause = 600;
      const loopPause = 2000;

      while (isFlickerLoopActive) {
        for (const numStr of correctPattern) {
          if (!isFlickerLoopActive) break;

          const numFlickers = parseInt(numStr, 10);
          for (let i = 0; i < numFlickers; i++) {
            if (!isFlickerLoopActive) break;

            buzzSound.play();
            houseFlicker = true;
            await sleep(flickerDuration);
            houseFlicker = false;

            if (i < numFlickers - 1) {
              await sleep(shortPause);
            }
          }
          if (!isFlickerLoopActive) break;
          await sleep(longPause);
        }

        if (isFlickerLoopActive) {
          await sleep(loopPause);
        }
      }
    } finally {
      // Ensure the guard is released when the loop finishes for any reason.
      isFlickerLoopRunning = false;
    }
  }

  function resetPattern() {
      if (isPlaying) return;
      knocks = [[], [], [], []];
      resultMessage = '';
      houseFlicker = false;

      if (!isFlickerLoopActive) {
        isFlickerLoopActive = true;
        playHouseFlickerPattern();
      }
  }
</script>

<JumpScare delay={7000} />

<main class="door-background min-h-screen flex flex-col items-center justify-center p-4">
  <div class="relative max-w-lg mb-8">

    <h1 class="text-6xl mb-4 font-creepster text-red-500 text-center">Trick or Treat</h1>


    <img src="/house3.jpeg" alt="House 3D" class="w-full object-contain"
         class:house-lightning-flicker={houseFlicker}
    />
  </div>

  <div class="bg-[#5c3a21] border-8 border-[#3d2514] p-6 md:p-8 rounded-lg shadow-2xl shadow-black/60 text-center w-full max-w-md">
    
    <h1 class="text-4xl md:text-5xl font-title text-amber-300 mb-2 uppercase tracking-wider engraved-text">
      Secret Knock
    </h1>
    <p class="font-body text-amber-200/70 mb-8">A specific pattern is required.</p>

    <div class="flex flex-col gap-3 mb-8">
      {#each { length: 4 } as _, rowIndex}
        <div class="grid grid-cols-4 gap-3">
          {#each { length: 4 } as _, colIndex}
            {@const isHighlighted = knocks[rowIndex]?.[colIndex]}
            {@const isPlayingCell = playingCell?.rowIndex === rowIndex && playingCell?.colIndex === colIndex}
            <div
              on:click={() => handleKnock(rowIndex, colIndex)}
              class="w-full aspect-square flex items-center justify-center rounded-md transition-all duration-150 shadow-inner shadow-black/50"
              class:cursor-pointer={!isPlaying}
              class:cursor-not-allowed={isPlaying}
              class:bg-black={!isHighlighted}
              class:border-2={!isHighlighted}
              class:border-black={!isHighlighted}
              class:hover:border-amber-400={!isPlaying && !isHighlighted}
              class:hover:bg-black={!isPlaying && !isHighlighted}
              class:bg-amber-600={isHighlighted && !isPlayingCell}
              class:border-amber-300={isPlayingCell}
              class:scale-110={isPlayingCell}
              class:shadow-lg={isPlayingCell}
              class:shadow-amber-400={isPlayingCell}
            >
              <img src="/knocker.png" alt="Knocker" class="w-2/3 h-2/3 object-contain opacity-50"
                class:opacity-100={isHighlighted || isPlayingCell}
                class:animate-knock={isPlayingCell}
              />
            </div>
          {/each}
        </div>
      {/each}
    </div>

    <div class="flex items-center justify-center gap-4">
        <button
          on:click={resetPattern}
          disabled={isPlaying}
          class="brass-button"
        >
          Reset
        </button>
        <button
          on:click={handleSubmit}
          disabled={isPlaying}
          class="brass-button px-8"
        >
          Knock
        </button>
    </div>

    <div class="mt-6 h-8 flex items-center justify-center">
      {#if resultMessage}
      <div class="text-2xl font-title tracking-widest"
      >
        {resultMessage}
      </div>
    {/if}
    </div>
  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=EB+Garamond&display=swap');

  /* Apply the custom fonts to Tailwind classes */
  .font-title {
    font-family: 'Cinzel Decorative', serif;
  }

  .font-body {
    font-family: 'EB Garamond', serif;
  }

  /* Simulated wood grain background for the page */
  .door-background {
    background-color: #3d2514;
    background-image: linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%), 
                      linear-gradient(90deg, #5c3a21 0px, #4a2e1a 4px, #4a2e1a 8px, #3d2514 12px);
    background-size: 100%, 12px 100%;
  }

  /* Engraved text effect for the title */
  .engraved-text {
    text-shadow: 1px 1px 0px #2a1b0e, 2px 2px 2px rgba(0,0,0,0.8);
  }

  /* Custom styles for the brass buttons */
  .brass-button {
    @apply px-6 py-3 bg-yellow-800 text-amber-100 rounded-sm uppercase tracking-wider;
    @apply border-2 border-t-amber-500 border-l-amber-600 border-b-yellow-950 border-r-yellow-950;
    @apply font-title text-sm font-bold transition-all duration-150;
    @apply disabled:opacity-50 disabled:cursor-not-allowed;
  }
  .brass-button:not(:disabled):hover {
     @apply bg-yellow-700;
  }
  .brass-button:not(:disabled):active {
     @apply bg-yellow-900 border-t-yellow-950 border-l-yellow-950 border-b-amber-500 border-r-amber-600;
  }


  /* Keyframe for the knocking animation */
  @keyframes knock-animation {
    0% { transform: scale(1); }
    50% { transform: scale(0.9) rotate(-5deg); } /* Simulate a slight movement */
    100% { transform: scale(1); }
  }

  .animate-knock {
    animation: knock-animation 0.2s ease-in-out;
  }

  /* New: Lightning flicker for the house image */
  .house-lightning-flicker {
    filter: brightness(150%) saturate(150%);
    transition: filter 0.05s ease-out; /* Quick transition for flicker */
  }
</style>