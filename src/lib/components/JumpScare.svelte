<script>
  import { onMount } from 'svelte';

  export let delay = 0;

  let videoElement;
  let showVideo = false;
  let closeTimer = null;

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

  $: if (showVideo && videoElement) {
    const playWhenReady = () => {
      if (videoElement.readyState >= 3) {
        videoElement.play();
        // Set a timer to hide the video 2 second after it starts
        closeTimer = setTimeout(hideVideo, 1200); 

        videoElement.requestFullscreen().catch(err => {
          console.error("Error attempting to enable full-screen mode:", err);
        });
      }
    };

    videoElement.addEventListener('canplaythrough', playWhenReady, { once: true });
    
    // Call it directly in case the event already fired
    playWhenReady();
  }
</script>

{#if showVideo}
  <div class="fullscreen-video">
    <video
      bind:this={videoElement}
      src="/scarelong.mp4"
      preload="auto"
      playsinline
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
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>