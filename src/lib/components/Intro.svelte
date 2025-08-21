<script>
  import { gameStore } from '$lib/gameStore.js';
  import { moodMusic, clickSound } from '$lib/audio.js';
  import { fade } from 'svelte/transition';

  function handleStart() {
    clickSound.play();
    if (!moodMusic.playing()) {
      moodMusic.play();
    }
    gameStore.startGame();
  }
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

<div class="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden p-4">
  <video 
    class="absolute top-0 left-0 w-full h-full object-cover"
    src="/background-bars.mp4" 
    autoplay 
    muted 
    playsinline
  >
    Your browser does not support the video tag.
  </video>
  
  <div class="absolute top-0 left-0 w-full h-full"></div>

  <div 
    class="relative z-10 flex flex-col items-center w-full max-w-lg p-8"
    in:fade={{ duration: 2000 }}
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