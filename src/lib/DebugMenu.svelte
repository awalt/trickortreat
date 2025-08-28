<script>
  import { gameStore } from '$lib/gameStore.js';
  // Import onMount to set the initial position
  import { onMount } from 'svelte';

  let isVisible = true;

  // --- Start of Drag Logic ---
  let menuElement; // The draggable div element
  let x, y; // The x and y coordinates of the menu
  let offsetX, offsetY; // The distance from the cursor to the element's corner
  let isDragging = false;

  // Position the menu in the bottom-right on its first appearance
  onMount(() => {
    if (menuElement) {
      x = window.innerWidth - menuElement.offsetWidth - 16; // 1rem = 16px
      y = window.innerHeight - menuElement.offsetHeight - 16;
    }
  });

  // Universal function to start dragging
  function startDrag(clientX, clientY) {
    isDragging = true;
    offsetX = clientX - x;
    offsetY = clientY - y;
  }
  
  // Universal function to handle movement
  function onDrag(clientX, clientY) {
    if (isDragging) {
      x = clientX - offsetX;
      y = clientY - offsetY;
    }
  }

  // Universal function to stop dragging
  function stopDrag() {
    isDragging = false;
  }

  // Mouse event handlers
  function handleMouseDown(event) {
    startDrag(event.clientX, event.clientY);
  }
  function handleMouseMove(event) {
    onDrag(event.clientX, event.clientY);
  }

  // Touch event handlers
  function handleTouchStart(event) {
    startDrag(event.touches[0].clientX, event.touches[0].clientY);
  }
  function handleTouchMove(event) {
    onDrag(event.touches[0].clientX, event.touches[0].clientY);
  }
  // --- End of Drag Logic ---


  function resetGame() {
    gameStore.reset();
  }

  function goTo(view) {
    gameStore.goToView(view);
  }

  function closeMenu() {
    isVisible = false;
  }
</script>

<svelte:window 
  on:mousemove={handleMouseMove} 
  on:mouseup={stopDrag}
  on:touchmove={handleTouchMove}
  on:touchend={stopDrag}
/>

{#if isVisible}
<div 
  bind:this={menuElement}
  class="fixed bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 border border-gray-600"
  style:left="{x}px"
  style:top="{y}px"
>
  <div 
    class="flex justify-between items-center mb-2"
    style="cursor: move; user-select: none;"
    on:mousedown={handleMouseDown}
    on:touchstart={handleTouchStart}
  >
    <h4 class="font-bold">Debug Menu</h4>
    <button 
      on:click={closeMenu}
      class="text-gray-400 hover:text-white text-xl leading-none p-1"
      title="Close debug menu"
    >
      ×
    </button>
  </div>
  <div class="grid grid-cols-2 gap-2">
    <button on:click={resetGame} class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">Reset Game</button>
    <button on:click={() => goTo('intro')} class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Intro</button>
    <button on:click={() => goTo('doorScene')} class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">DoorScene</button>
    <button on:click={() => goTo('door')} class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Door</button>
    <button on:click={() => goTo('puzzle2')} class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Puzzle 2</button>
    <button on:click={() => goTo('knock')} class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Knock</button>
    <button on:click={() => goTo('bug')} class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Bug</button>
    <button on:click={() => goTo('conclusion')} class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Conclusion</button>
  </div>
</div>
{/if}