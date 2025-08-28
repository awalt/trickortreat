<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  // Import the new component
  import GreenscreenVideo from '$lib/GreenscreenVideo.svelte'; // Adjust path if needed

    let showVideo = false; // Controls when the video appears
  let timer; // To hold the reference to our timer

onMount(() => {
    timer = setTimeout(() => {
      showVideo = true;
    }, 2000);
  });

</script>

<div class="relative w-full h-full flex flex-col items-center justify-center p-8 text-center bg-green-900

text-gray-300 overflow-hidden" in:fade={{ duration: 1000 }}>

  <!-- The animated video that crawls "on top" of the screen -->
  <div class="video-container">
    <!-- Replace with the actual path to your greenscreen video -->
    {#if showVideo}
      <GreenscreenVideo src="/beetle.mp4" tolerance={190} />
    {/if}
  </div>

  <!-- Page Content -->
  <div class="z-10">
    <h1 class="text-5xl md:text-6xl mb-4 font-serif text-yellow-400">
      Peephole
    </h1>
    <img src="/path.png" alt="" class="w-full h-auto max-w-lg">
    <p class="text-lg md:text-xl max-w-2xl mx-auto">
      There would be like a vignette peephole around the image or something.
    </p>
  </div>

</div>

<style>
  .video-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    pointer-events: none;
    overflow: hidden;

    /* These styles make the video itself move */
    width: 100%; /* Adjust size of the video as needed */
    height: 100%;
    will-change: transform;
  }

  /* Keyframe animation for the video's movement.
    This is the same animation path that the SVG beetle used.
  */
  @keyframes crisscross {
    0% {
      transform: translate(-10%, 20%) rotate(25deg);
    }
    15% {
      transform: translate(30vw, -10%) rotate(-10deg);
    }
    30% {
      transform: translate(60vw, 30vh) rotate(45deg);
    }
    45% {
      transform: translate(100vw, 20vh) rotate(0deg); /* Moves off-screen right */
    }
    46% {
        /* Disappears for a moment before re-entering */
      transform: translate(50vw, 110%) rotate(0deg);
    }
    60% {
      transform: translate(80vw, 70vh) rotate(-30deg);
    }
    75% {
      transform: translate(20vw, 100vh) rotate(15deg); /* Moves off-screen bottom */
    }
    90% {
      transform: translate(-10%, 80vh) rotate(60deg); /* Re-enters from left */
    }
    100% {
      transform: translate(-10%, 20%) rotate(25deg); /* Returns to start */
    }
  }
</style>
