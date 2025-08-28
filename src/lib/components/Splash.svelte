<script>
  import { fade } from 'svelte/transition';
</script>

<div class="w-full h-screen flex flex-col items-center justify-center text-center bg-gray-900" in:fade={{ duration: 500 }}>
  <h1 class="text-6xl font-creepster text-orange-500 animate-pulse">Loading...</h1>
</div>
