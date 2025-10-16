<script>
  import { gameStore } from '$lib/gameStore.js';
  import { moodMusic, clickSound } from '$lib/audio.js';
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';


  let showInfoModal = false;


  function handleStart() {
    clickSound.play();
    if (!moodMusic.playing()) {
      moodMusic.play();
    }
    
    // Enter fullscreen
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }

    gameStore.startGame();
    //gameStore.solvePuzzle();
  }
  function toggleInfoModal() {
    showInfoModal = !showInfoModal;
  }

  onMount(() => {
    // Preload the transition video
    const video = document.createElement('video');
    video.src = '/runninghouse.mp4';
    video.preload = 'auto';

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  });
</script>

<style>
  /* This custom animation creates a slow, subtle pulse for the text-shadow,
     giving the tagline a "glowing ember" effect.
  */
  @keyframes flicker {
    0%, 100% {
      text-shadow: 0 0 6px rgba(245, 158, 11, 0.5), 0 0 12px rgba(245, 158, 11, 0.3);
    }
    50% {
      text-shadow: 0 0 10px rgba(251, 191, 36, 0.6), 0 0 20px rgba(251, 191, 36, 0.4);
    }
  }

  .animate-flicker {
    animation: flicker 4s ease-in-out infinite;
  }

  @keyframes grow-shrink {
    0% {
      transform: scale(0.7);
      opacity: 0;
    }
    80% {
      transform: scale(1.05);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .animate-grow-shrink {
    animation: grow-shrink 0.4s ease-out forwards;
  }
</style>

<div class="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden p-4"
 in:fade={{ duration: 500 }}>
  <video 
    class="absolute top-0 left-0 w-full h-full object-cover"
    src="/housestatic.mp4" 
    autoplay 
    muted 
    playsinline
    on:canplaythrough={() => gameStore.setIntroVideoReady()}
  >
    Your browser does not support the video tag.
  </video>
  
  <div class="absolute top-0 left-0 w-full h-full"></div>

  {#if !$gameStore.introVideoReady}
    <div class="absolute z-20 text-white/50 text-lg tracking-widest" transition:fade>
      
    </div>
  {/if}

  {#if $gameStore.introVideoReady}
    <div 
      class="relative z-10 flex flex-col items-center w-full max-w-4xl p-8"
      in:fade={{ delay: 200, duration: 2000 }}
    >
      <div class=" w-full">
        
        <div class="">
          <div class="h-px bg-gradient-to-r from-transparent via-orange-700 to-transparent mb-4 landscape:hidden"></div>
          <h1 
            class="text-6xl md:text-8xl landscape:text-5xl font-bold mb-4 landscape:mb-0 tracking-wider uppercase" 
            style="font-family: 'Creepster', cursive; text-shadow: 0 0 15px #ff6600, 0 0 25px #ff6600;"
          >
            Where Trick or Treat Meets Escape&nbsp;Room
          </h1>
          <div class="h-px bg-gradient-to-r from-transparent via-orange-700 to-transparent mt-4 landscape:hidden"></div>
        </div>

        <div class="">
          <p class="font-sans text-xl my-4 tracking-widest font-bold
                text-gray-200
                animate-flicker text-center">
            Solve the puzzles. Claim the candy… if you dare.
          </p>
        </div>
      </div>

      <div class="flex flex-col items-center mt-8 landscape:mt-4">
        <div
          class="flex items-center gap-2 text-white/50 text-xs font-sans tracking-wider uppercase mb-4"
          in:fade={{ delay: 1000, duration: 2000 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"  viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" fill="none">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.11 12.822c-2.55.684-4.29 1.378-3.376 4.787.913 3.41 2.766 3.141 5.317 2.458l-.97-3.622zm9.78 0c2.55.684 4.29 1.378 3.376 4.787-.913 3.41-2.766 3.141-5.317 2.458l.97-3.622zm2.429.912a7.75 7.702 0 0 0-2.72-8.732 7.75 7.702 0 0 0-9.198 0 7.75 7.702 0 0 0-2.72 8.732"></path>
          </svg>
          <span>Headphones Recommended</span>
        </div>

        <button 
          on:click={handleStart}
          class="relative inline-block px-10 py-3 font-bold text-lg text-white uppercase tracking-widest transition-all duration-300
                bg-black/50 border border-orange-800/50 rounded-tl-xl rounded-br-xl
                hover:border-orange-600 hover:shadow-[0_0_20px_rgba(255,110,50,0.5)] hover:scale-110"
        >
          Start
        </button>


        <div class="mt-12 pt-8 border-t border-gray-700/30 mb-3">
        <p class="text-gray-400 text-sm">
  <button 
    on:click={toggleInfoModal} 
    class="text-orange-400 hover:text-orange-300 underline transition-colors duration-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
    aria-label="Show game information"
  >
    This game
  </button> 
  was conjured by 
  <a 
    href="https://www.mobileescapes.ca/about-us"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 underline transition-colors duration-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
  >
    Mobile Escapes
    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
  </a>.
</p>
      </div>
      </div>
    </div>
  {/if}

  {#if showInfoModal}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      on:click|self={toggleInfoModal}
      transition:fade={{ duration: 300 }}
    >
      <div class="bg-gray-900/80 border border-orange-500/50 rounded-lg shadow-xl p-8 max-w-lg w-full relative text-white animate-grow-shrink">
        <button
          on:click={toggleInfoModal}
          class="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="flex flex-col items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-2xl font-bold text-orange-400 text-center">Game Info</h2>
        </div>

        <div class="text-gray-300 space-y-4">
          <p>
            This free 10-minute game was conjured up by Alex, Eric, and Nick to celebrate Halloween 2025! We wanted to give you a taste of the custom-tailored adventures we can create at Mobile&nbsp;Escapes.
          </p>
          <p>
            Our main goal is for you to have a blast solving these spooky puzzles. If you enjoyed the experience, we hope you'll think of Mobile&nbsp;Escapes for your next real-life or virtual escape room adventure!
          </p>
        </div>

        <div class="mt-8 text-right">
          <button on:click={toggleInfoModal} class="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            OK
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>