<script>
  import { gameStore } from '$lib/gameStore.js';
  import { fade } from 'svelte/transition';

  function handleVideoEnd() {
    gameStore.finishWalking();
  }
</script>

<div class="fixed inset-0 w-full h-full bg-black z-50"
  in:fade={{ duration: 1000 }}>
  <video
    src="/walk.mp4"
    autoplay
    muted
    playsinline
    on:ended={handleVideoEnd}
    class="w-full h-full object-cover"
  >
    Your browser does not support the video tag.
  </video>
</div>