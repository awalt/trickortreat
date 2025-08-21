<!-- FILE: src/routes/+page.svelte -->
<!-- This is the main component that acts as a controller, showing the correct view. -->
<script>
  import { gameStore } from '$lib/gameStore.js';
  
  // Import the different "pages" of your game
  import Intro from './Intro.svelte';
  import Puzzle1 from './Puzzle1.svelte';
  import Conclusion from './Conclusion.svelte';

  // The Svelte '$' syntax automatically subscribes to the store.
  // When the value of gameStore changes, this component will re-render.
  const currentView = $gameStore.currentView;
</script>

<main class="w-full h-screen bg-black text-white font-sans">
  {#if $gameStore.currentView === 'intro'}
    <Intro />
  {:else if $gameStore.currentView === 'puzzle1'}
    <Puzzle1 />
  {:else if $gameStore.currentView === 'conclusion'}
    <Conclusion />
  {/if}
</main>