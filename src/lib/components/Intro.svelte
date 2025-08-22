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

    <div
    class="flex items-center gap-2 text-white/50 text-xs font-sans tracking-wider uppercase mb-4"
    in:fade={{ delay: 1500, duration: 2000 }}
  >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
</svg>

    <span>Sound Recommended</span>
  </div>

      <div
    class="flex items-center gap-2 text-white/50 text-xs font-sans tracking-wider uppercase mb-4"
    in:fade={{ delay: 1500, duration: 2000 }}
  >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0  56 56" stroke-width="5" stroke="currentColor">

    <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 5.5234 41.2422 L 6.7890 41.2422 C 7.1640 41.2422 7.3749 41.0078 7.3749 40.6562 L 7.3749 27.4375 C 7.3749 16.3281 15.7656 9.1094 28.0000 9.1094 C 40.2578 9.1094 48.6248 16.3281 48.6248 27.4375 L 48.6248 40.6562 C 48.6248 41.0078 48.8360 41.2422 49.2109 41.2422 L 50.4767 41.2422 C 51.5077 41.2422 52.2344 40.5859 52.2344 39.625 L 52.2344 26.5703 C 52.2344 14.125 42.4140 5.4766 28.7968 5.4766 L 27.2031 5.4766 C 13.5859 5.4766 3.7656 14.125 3.7656 26.5703 L 3.7656 39.625 C 3.7656 40.5859 4.5156 41.2422 5.5234 41.2422 Z M 12.2734 50.5234 L 14.4765 50.5234 C 17.3593 50.5234 18.9765 49.0000 18.9765 46.3047 L 18.9765 36.1797 C 18.9765 33.4844 17.3593 31.9609 14.4765 31.9609 L 12.2734 31.9609 C 10.7031 31.9609 9.8359 32.8047 9.8359 34.3516 L 9.8359 48.1328 C 9.8359 49.7031 10.7031 50.5234 12.2734 50.5234 Z M 41.5468 50.5234 L 43.7500 50.5234 C 45.3437 50.5234 46.2344 49.7031 46.2344 48.1328 L 46.2344 34.3516 C 46.2344 32.8047 45.3437 31.9609 43.7500 31.9609 L 41.5468 31.9609 C 38.6874 31.9609 37.0702 33.4844 37.0702 36.1797 L 37.0702 46.3047 C 37.0702 49.0000 38.6874 50.5234 41.5468 50.5234 Z"></path></g></svg>

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