<script>
  import { gameStore, gamePagesOrder } from '$lib/gameStore.js';
  import { onMount } from 'svelte';
  let isVisible = true;
  let menuElement;
  let x, y;
  let offsetX, offsetY;
  let isDragging = false;
  onMount(() => {
    if (menuElement) {
      x = window.innerWidth - menuElement.offsetWidth - 16;
      y = window.innerHeight - menuElement.offsetHeight - 16;
    }
  });
  function startDrag(clientX, clientY) {
    isDragging = true;
    offsetX = clientX - x;
    offsetY = clientY - y;
  }
  function onDrag(clientX, clientY) {
    if (isDragging) {
      x = clientX - offsetX;
      y = clientY - offsetY;
    }
  }
  function stopDrag() {
    isDragging = false;
  }
  function handleMouseDown(event) {
    startDrag(event.clientX, event.clientY);
  }
  function handleMouseMove(event) {
    onDrag(event.clientX, event.clientY);
  }
  function handleTouchStart(event) {
    startDrag(event.touches[0].clientX, event.touches[0].clientY);
  }
  function handleTouchMove(event) {
    onDrag(event.touches[0].clientX, event.touches[0].clientY);
  }
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
    {#each gamePagesOrder as page}
        <button on:click={() => goTo(page)} class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">{page}</button>
    {/each}
  </div>
</div>
{/if}