<script>
  import { onMount } from 'svelte';

  export let delay = 0;

  let videoElement;
  let showVideo = false;
  let closeTimer = null;
  let videoReady = false; // New state to track if video is ready

  onMount(() => {
    const startTimeout = setTimeout(() => {
      showVideo = true;
    }, delay);

    // Cleanup timers when the component is destroyed
    return () => {
      clearTimeout(startTimeout);
      if (closeTimer) clearTimeout(closeTimer);
    };
  });

  const hideVideo = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    showVideo = false;
  };

  // This function now runs when the video is buffered and ready
  const onCanPlay = () => {
    videoReady = true; // Make the container visible
    videoElement.play();
    
    // Set a timer to hide the video 1.2 seconds after it starts
    closeTimer = setTimeout(hideVideo, 550);

    videoElement.requestFullscreen().catch(err => {
      console.error("Error attempting to enable full-screen mode:", err);
    });
  }
</script>

{#if showVideo}
  <div class="fullscreen-video" style="opacity: {videoReady ? 1 : 0};">
    <video
      bind:this={videoElement}
      src="/scareshort.mp4"
      preload="auto"
      playsinline
      poster="/scareshort.png"
      on:canplaythrough={onCanPlay}
    />
  </div>
{/if}

<style>
  .fullscreen-video {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    /* Smooth fade-in transition */
    transition: opacity 0.1s linear;
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>