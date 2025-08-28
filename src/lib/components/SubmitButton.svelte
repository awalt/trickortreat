<script>
  import { createEventDispatcher } from 'svelte';
  import { successSound, errorSound, clickSound } from '$lib/audio.js';

  export let isCorrect = null;
  export let continueLabel = 'Continue';
  export let attempt = 0; // <-- ADD THIS LINE: A prop to track submission attempts

  let isShaking = false;
  let errorMessage = '';

  const dispatch = createEventDispatcher();

  function handleSubmit() {
    console.log("Submit")
    dispatch('submit');
  }

  function handleContinue() {
    dispatch('continue');
  }

  // v-- CHANGE THIS BLOCK --v
  // This logic now runs every time `attempt` changes,
  // guaranteeing the feedback triggers on every submission.
  $: if (attempt >= 0) {
    console.log("Attempt", attempt)
    if (isCorrect) {
      successSound.play();
      errorMessage = '';
      isShaking = false;

      // ADD THIS: Hide the keyboard on success by blurring the active element.
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    } else if (isCorrect === false) {
      // This block will now run every time for a wrong answer
      errorSound.play();
      errorMessage = 'Incorrect Code. Try Again.';
      isShaking = true;
      setTimeout(() => (isShaking = false), 500);
    }
  }
</script>

<div class="flex flex-col items-center mt-1">
  <div class="flex flex-col items-center justify-center min-h-24">
    {#if isCorrect !== true}
      <button
        on:click={handleSubmit}
        class="relative flex items-center gap-2 rounded-lg py-3 px-5 text-xl font-bold shadow-lg transition-all duration-300"
        class:shake={isShaking}
        class:border-red-700={!isCorrect}
        class:bg-red-900={!isCorrect}
        class:hover:bg-red-800={!isCorrect}
        class:hover:scale-105={!isCorrect}
        class:active:scale-100={!isCorrect}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span>ENTER</span>
      </button>
    {:else}
      <div class="flex flex-col items-center">
        <div class="flex items-center gap-2 text-xl font-bold text-green-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
            />
          </svg>
          <span>UNLOCKED</span>
        </div>
        <button
          on:click={handleContinue}
          class="mt-4 rounded-lg border-2 border-blue-400 bg-blue-600 py-2 px-6 text-lg font-bold text-white shadow-lg shadow-blue-600/50 transition-all duration-300 hover:scale-105 hover:bg-blue-500 hover:shadow-blue-500/70 active:scale-100"
        >
          {continueLabel}
        </button>
      </div>
    {/if}
  </div>

  <p
    class="mt-4 h-6 text-red-500 transition-opacity duration-300"
    class:animate-pulse={errorMessage}
    class:opacity-100={errorMessage}
    class:opacity-0={!errorMessage}
  >
    {errorMessage || ''}
  </p>
</div>

<style>
  .shake {
    animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
  }

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }
    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }
    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }
    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
</style>