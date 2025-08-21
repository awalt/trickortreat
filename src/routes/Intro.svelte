<!-- FILE: src/routes/Intro.svelte -->
<script>
  import { gameStore } from '$lib/gameStore.js';
  import { moodMusic, clickSound } from '$lib/audio.js';

  function handleStart() {
    // Play sounds on the first user interaction
    clickSound.play();
    
    // Check if music is already playing to avoid restarting it
    if (!moodMusic.playing()) {
      moodMusic.play();
    }
    
    // Update the game state to move to the first puzzle
    gameStore.startGame();
  }
</script>

<div class="relative w-full h-full flex flex-col items-center justify-center text-center overflow-hidden p-4">
  <!-- 
    Background Video:
    - object-cover ensures the video covers the entire screen, cropping sides if needed.
    - This is exactly what's needed for a responsive full-screen background.
  -->
  <video 
    class="absolute top-1/2 left-1/2 w-auto h-auto min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover -z-10"
    src="/background.mp4" 
    autoplay 
    loop 
    muted 
    playsinline
  >
    Your browser does not support the video tag.
  </video>
  
  <!-- Overlay to darken the video slightly -->
  <div class="absolute top-0 left-0 w-full h-full bg-black/50"></div>

  <!-- 
    UI CHANGE: Centered Content Box
    - This div is now a styled box that floats in the middle of the screen.
    - `bg-black/70` gives it a semi-transparent background.
    - `backdrop-blur-sm` adds a subtle glass-like effect.
    - `max-w-md` and `w-full` make it responsive.
  -->
  <div class="relative z-10 bg-black/70 backdrop-blur-sm rounded-xl shadow-2xl shadow-black/50 max-w-md w-full p-8 md:p-12">
    <h1 class="text-5xl md:text-6xl font-bold mb-4 tracking-wider">THE ESCAPE</h1>
    <p class="text-lg md:text-xl mb-8">You are trapped. Can you solve the puzzles to get out?</p>
    <button 
      on:click={handleStart}
      class="bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-8 rounded-lg text-xl transition-all duration-300 shadow-lg hover:shadow-xl shadow-red-900/50"
    >
      Begin
    </button>
  </div>
</div>