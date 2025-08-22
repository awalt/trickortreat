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
  }

  // `onMount` runs only in the browser, after the component has been rendered.
  onMount(() => {
    // Disable scrolling when the component is shown
    document.body.style.overflow = 'hidden';

    // The function returned from onMount runs when the component is destroyed.
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
    src="/statichouse.mp4" 
    autoplay 
    muted 
    playsinline
  >
    Your browser does not support the video tag.
  </video>
  
  <div class="absolute top-0 left-0 w-full h-full"></div>

  <div 
    class="relative z-10 flex flex-col items-center w-full max-w-lg p-8"
    in:fade={{ delay: 800,duration: 2000 }}
  >
    <div class="w-1/3 h-px bg-gradient-to-r from-transparent via-orange-700 to-transparent mb-4"></div>

    <h1 
      class="text-6xl md:text-8xl font-bold mb-4 tracking-wider uppercase" 
      style="font-family: 'Creepster', cursive; text-shadow: 0 0 15px #ff6600, 0 0 25px #ff6600;"
    >
      Trick Or Treat
    </h1>

    <div class="w-1/3 h-px bg-gradient-to-r from-transparent via-orange-700 to-transparent mt-4"></div>

    <p class="font-sans text-xl my-8 tracking-widest font-bold
             text-gray-200
             animate-flicker">
      This won't be just an easy candy&nbsp;handout.
    </p>

    <!-- <div
    class="flex items-center gap-2 text-white/50 text-xs font-sans tracking-wider uppercase mb-4"
    in:fade={{ delay: 1200, duration: 2000 }}
  >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
</svg>

    <span>Sound Recommended</span>
  </div> -->

      <div
    class="flex items-center gap-2 text-white/50 text-xs font-sans tracking-wider uppercase mb-4"
    in:fade={{ delay: 1500, duration: 2000 }}
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