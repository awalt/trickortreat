<script>
  import { gameStore } from '$lib/gameStore.js';
  import { fade } from 'svelte/transition';

  let videoElement;
  let fadingToBlack = false;

  function handleTimeUpdate() {
    // Ensure the video element and its duration are available before checking the time
    if (!videoElement || !videoElement.duration) return;

    const timeUntilEnd = videoElement.duration - videoElement.currentTime;

    // Start fading 3 seconds before the video ends and ensure we only set it once
    if (timeUntilEnd <= 1.5 && !fadingToBlack) {
      fadingToBlack = true;
    }
  }
</script>

<style>
  .fade-overlay {
    transition: opacity 2.5s ease-in-out;
  }
</style>

<div class="relative w-full h-screen" in:fade={{ duration: 500 }}>
  <video 
    bind:this={videoElement}
    class="w-full h-full object-cover"
    src="/walk2.mp4" 
    autoplay 
    playsinline
    on:timeupdate={handleTimeUpdate}
    on:ended={() => gameStore.finishWalking()}
  >
    Your browser does not support the video tag.
  </video>

  <div 
    class="fade-overlay absolute inset-0 bg-black pointer-events-none"
    class:opacity-100={fadingToBlack}
    class:opacity-0={!fadingToBlack}
  >
  </div>
</div>