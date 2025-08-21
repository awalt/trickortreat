<!-- FILE: src/routes/Puzzle1.svelte -->
<script>
  import { gameStore } from '$lib/gameStore.js';
  import { clickSound, successSound, errorSound } from '$lib/audio.js';
  import { tick } from 'svelte';

  let userInput = '';
  let errorMessage = '';
  const correctAnswer = '482'; // The secret code for this puzzle

  async function checkAnswer() {
    clickSound.play();
    errorMessage = ''; // Reset error message

    if (userInput === correctAnswer) {
      successSound.play();
      // Wait a moment before changing the view
      setTimeout(() => {
        gameStore.solvePuzzle('puzzle1');
      }, 500);
    } else {
      errorSound.play();
      errorMessage = 'Incorrect Code. Try Again.';
      userInput = ''; // Clear input on error
      
      // Briefly shake the input for feedback
      const inputEl = document.querySelector('#codeInput');
      if (inputEl) {
        inputEl.classList.add('shake');
        setTimeout(() => inputEl.classList.remove('shake'), 500);
      }
    }
  }
</script>

<div class="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gray-900">
  <h2 class="text-3xl font-bold mb-4">The First Clue</h2>
  <p class="text-gray-400 mb-8 max-w-md">
    A dusty note on the wall reads: "I am the number of sides on a square, multiplied by the number of planets in the sky, divided by the number of lives a cat has... minus one." What is the three-digit code?
  </p>
  
  <div class="flex flex-col items-center">
    <input
      id="codeInput"
      type="number"
      bind:value={userInput}
      placeholder="---"
      maxlength="3"
      class="bg-gray-800 border-2 border-gray-600 text-white text-4xl text-center w-36 py-3 rounded-lg tracking-[0.3em] focus:outline-none focus:border-red-500"
      on:input={() => { if (userInput.length > 3) userInput = userInput.slice(0, 3); }}
    />
    <button 
      on:click={checkAnswer}
      class="mt-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300"
    >
      Unlock
    </button>
    
    {#if errorMessage}
      <p class="text-red-500 mt-4 animate-pulse">{errorMessage}</p>
    {/if}
  </div>
</div>

<style>
  .shake {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
  }
  @keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
  }
</style>