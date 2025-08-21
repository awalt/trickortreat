<script>
  import { gameStore } from '$lib/gameStore.js';

  function resetGame() {
    gameStore.reset();
  }

  function goTo(view) {
    gameStore.goToView(view);
  }
</script>

<div class="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 border border-gray-600">
  <h4 class="font-bold mb-2 text-center">Debug Menu</h4>
  <div class="grid grid-cols-2 gap-2">
    <button on:click={resetGame} class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">Reset Game</button>
    <button on:click={() => goTo('intro')} class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Intro</button>
    <button on:click={() => goTo('puzzle1')} class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Puzzle 1</button>
    <button on:click={() => goTo('puzzle2')} class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Puzzle 2</button>
    <button on:click={() => goTo('conclusion')} class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Conclusion</button>
  </div>
</div>