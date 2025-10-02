<script>
  import { gameStore } from '$lib/gameStore.js';
  import { moodMusic, clickSound } from '$lib/audio.js';
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';


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
      </div>
    </div>
  {/if}
</div>