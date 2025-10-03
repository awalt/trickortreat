<script>
  import { onMount } from 'svelte';
  
  // UPDATED: finalTime is no longer a prop and will be loaded from localStorage.
  let finalTime = "00:00"; 
  export let playerName = "";
  
  let showNameInput = false;
  let isSubmitting = false;
  let nameSubmitted = false;
  
  let highscores = [
    { name: "SpookMaster", time: "03:45" },
    { name: "GhostHunter", time: "04:12" },
    { name: "PumpkinKing", time: "04:33" },
    { name: "WitchyWiz", time: "05:01" },
    { name: "BatSignal", time: "05:28" }
  ];
  
  // NEW: This helper function formats seconds into MM:SS
  function formatTimeFromSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
  }

  function showHighscoreInput() {
    showNameInput = true;
  }
  
  function submitScore() {
    if (playerName.trim()) {
      isSubmitting = true;
      
      setTimeout(() => {
        highscores = [...highscores, { name: playerName.trim(), time: finalTime }]
          .sort((a, b) => timeToSeconds(a.time) - timeToSeconds(b.time))
          .slice(0, 10);
        
        isSubmitting = false;
        nameSubmitted = true;
        showNameInput = false;
      }, 1500);
    }
  }
  
  function timeToSeconds(timeStr) {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  }
  
  function shareGame() {
    if (navigator.share) {
      navigator.share({
        title: 'Halloween Escape Room',
        text: `I just escaped in ${finalTime}! Can you beat my time?`,
        url: window.location.origin
      });
    } else {
      const shareText = `I just escaped the Halloween Escape Room in ${finalTime}! Can you beat my time? ${window.location.origin}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Share link copied to clipboard!');
      });
    }
  }
  
  onMount(() => {
    // --- NEW: Read the final time from localStorage ---
    const finalTimeInSeconds = localStorage.getItem('gameFinalTime');
    if (finalTimeInSeconds) {
      finalTime = formatTimeFromSeconds(parseInt(finalTimeInSeconds, 10));
    }
    // --- End of new code ---

    const elements = document.querySelectorAll('.animate-in');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('opacity-100', 'translate-y-0');
      }, index * 200);
    });
  });
</script>

<div class="w-full min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-purple-900 via-gray-900 to-black relative overflow-hidden">
  <!-- Spooky background elements -->
  <div class="absolute inset-0 opacity-10">
    <div class="absolute top-20 left-10 text-6xl">🎃</div>
    <div class="absolute top-40 right-20 text-4xl">👻</div>
    <div class="absolute bottom-32 left-20 text-5xl">🦇</div>
    <div class="absolute bottom-20 right-10 text-4xl">🕷️</div>
    <div class="absolute top-60 left-1/3 text-3xl">🌙</div>
  </div>
  
  <!-- Main content -->
  <div class="relative z-10 max-w-4xl mx-auto">
    <!-- Success message -->
    <div class="animate-in opacity-0 translate-y-8 transition-all duration-1000">
      <h1 class="text-7xl md:text-8xl font-bold text-orange-500 mb-4 drop-shadow-lg animate-pulse">
        YES!
      </h1>
      <p class="text-gray-300 text-2xl mb-8">
        Congratulations! You deserve candy.
      </p>
    </div>
    
    <!-- Final time display -->
    <div class="animate-in opacity-0 translate-y-8 transition-all duration-1000 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-orange-500/30">
      <h2 class="text-3xl font-bold text-orange-400 mb-2">Your Time:</h2>
      <div class="text-6xl font-mono text-green-400 mb-2">{finalTime}</div>
      <p class="text-gray-400">Not bad for a mortal! 👻</p>
    </div>
    
    <!-- Highscore section -->
    <div class="animate-in opacity-0 translate-y-8 transition-all duration-1000 mb-8">
      {#if !nameSubmitted && !showNameInput}
        <button 
          on:click={showHighscoreInput}
          class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-purple-500/30 mb-6"
        >
          🏆 Add to Leaderboard
        </button>
      {:else if showNameInput}
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-purple-500/30">
          <h3 class="text-xl font-bold text-purple-400 mb-4">Enter Your Name for the Leaderboard</h3>
          <div class="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <input 
              bind:value={playerName}
              placeholder="Enter your spooky name..."
              class="px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
              maxlength="20"
            />
            <button 
              on:click={submitScore}
              disabled={isSubmitting || !playerName.trim()}
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded font-bold transition-all duration-300 flex items-center gap-2"
            >
              {#if isSubmitting}
                <span class="animate-spin">⚡</span> Submitting...
              {:else}
                Submit Score
              {/if}
            </button>
          </div>
        </div>
      {:else if nameSubmitted}
        <div class="bg-green-800/50 backdrop-blur-sm rounded-lg p-4 mb-6 border border-green-500/30">
          <p class="text-green-400 font-bold">✅ Score submitted successfully!</p>
        </div>
      {/if}
      
      <!-- Leaderboard -->
      <div class="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-600/30">
        <h3 class="text-2xl font-bold text-yellow-400 mb-4">🏆 Leaderboard - Top Escapees</h3>
        <div class="space-y-2">
          {#each highscores.slice(0, 5) as score, index}
            <div class="flex justify-between items-center p-2 rounded {index < 3 ? 'bg-yellow-500/20' : 'bg-gray-700/30'}">
              <div class="flex items-center gap-3">
                <span class="text-lg font-bold {index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-gray-400'}">
                  {index + 1}.
                </span>
                <span class="text-white font-medium">{score.name}</span>
                {#if score.name === playerName.trim()}
                  <span class="text-green-400 text-sm">← You!</span>
                {/if}
              </div>
              <span class="font-mono text-green-400 font-bold">{score.time}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
    
    <!-- Share and promotion section -->
    <div class="animate-in opacity-0 translate-y-8 transition-all duration-1000 space-y-6">
      <!-- Share button -->
      <div>
        <button 
          on:click={shareGame}
          class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-blue-500/30"
        >
          📱 Share with Friends
        </button>
        <p class="text-gray-400 mt-2">Challenge your friends to beat your time!</p>
      </div>
      
      <!-- Blue Moon promotion -->
      <div class="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 backdrop-blur-sm rounded-lg p-8 border border-blue-500/30 max-w-4xl mx-auto">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <!-- Image -->
          <div class="order-2 md:order-1">
            <img 
              src="https://virtual.mobileescapes.ca/blue-moon/promo_en.jpg" 
              alt="Once in a Blue Moon escape room promo" 
              class="w-full max-w-sm mx-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
          </div>
          
          <!-- Content -->
          <div class="order-1 md:order-2">
            <h3 class="text-3xl font-bold text-blue-300 mb-4">🌙 Once in a Blue Moon</h3>
            <p class="text-gray-300 text-lg mb-4">
              Experience the ultimate Halloween escape room! Race to escape a spooky manor 
              during a rare blue moon on October 31st. Perfect for team building and special events.
            </p>
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="bg-blue-600/30 px-3 py-1 rounded-full text-blue-200 text-sm">🎯 Team Building</span>
              <span class="bg-blue-600/30 px-3 py-1 rounded-full text-blue-200 text-sm">🎉 Private Events</span>
              <span class="bg-blue-600/30 px-3 py-1 rounded-full text-blue-200 text-sm">🏢 Corporate Packages</span>
            </div>
            
            <!-- Promo code highlight -->
            <div class="bg-orange-500/20 border border-orange-400 rounded-lg p-4 mb-6">
              <p class="text-orange-200 font-bold text-lg">🎃 Halloween Special!</p>
              <p class="text-orange-100">Use code <span class="font-mono bg-orange-600 px-2 py-1 rounded text-white">HALLLOWEEN</span></p>
              <p class="text-orange-200 text-sm">50% off for up to 20 players</p>
            </div>
            
            <a 
              href="https://www.mobileescapes.ca/about-us"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-blue-500/50"
            >
              Book Now
            </a>
          </div>
        </div>
      </div>
      
      <!-- Play again -->
      <div>
        <button 
          on:click={() => window.location.href = '/'}
          class="mb-4 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-orange-500/30"
        >
          🎃 Play Again
        </button>
      </div>


      <!-- Footer -->
<div class="mt-12 pt-8 border-t border-gray-700/30 mb-3">
  <p class="text-gray-400 text-sm">
    Made with ❤️ in Ottawa by 
    <a 
      href="https://www.mobileescapes.ca/about-us"
      target="_blank"
      rel="noopener noreferrer"
      class="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
    >
      Mobile Escapes
    </a>
  </p>
</div>


    </div>
  </div>
</div>

<style>
  .animate-in {
    transition: opacity 1s ease-out, transform 1s ease-out;
  }
  
  /* Custom Halloween-themed animations */
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .8; }
  }
</style>
