<script>
  /* SubmitButton.svelte */
  import { createEventDispatcher, onMount } from 'svelte';
  import { successSound, errorSound } from '$lib/audio.js';

  // --- PROPS ---
  export let isCorrect = null;
  export let continueLabel = 'Continue';
  export let inputType = 'text'; // 'text', 'number', or 'directional'
  export let maxLength = 3;
  export let combinationLength = 3; // For directional input

  // --- LOCAL STATE ---
  let userInput = ''; // For text/number input
  let directions = []; // For directional input
  let attempt = -1;
  let isShaking = false;
  let errorMessage = '';
  const dispatch = createEventDispatcher();

  // Initialize directions array when the component mounts
  onMount(() => {
    if (inputType === 'directional') {
      directions = Array(combinationLength).fill('up');
    }
  });

  // --- MAPPINGS ---
  const directionCycle = ['up', 'right', 'down', 'left'];
  const rotationMap = {
    up: 0,
    right: 90,
    down: 180,
    left: 270,
  };

  // --- FUNCTIONS ---
  function rotateArrow(index) {
    const currentDirection = directions[index];
    const currentIndex = directionCycle.indexOf(currentDirection);
    const nextIndex = (currentIndex + 1) % directionCycle.length;
    directions[index] = directionCycle[nextIndex];
  }

  function handleSubmit() {
    const valueToSubmit = inputType === 'directional' ? directions : userInput;
    if (inputType === 'directional' || userInput) {
      attempt++;
      dispatch('submit', valueToSubmit);
    }
  }

  function handleContinue() {
    dispatch('continue');
  }

  function handleKeyUp(event) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  // --- REACTIVE LOGIC ---
  $: if (attempt >= 0) {
    if (isCorrect) {
      successSound.play();
      errorMessage = '';
      isShaking = false;
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    } else if (isCorrect === false) {
      errorSound.play();
      errorMessage = 'Incorrect Code. Try Again.';
      isShaking = true;
      setTimeout(() => (isShaking = false), 500);

      // Reset input on failure
      if (inputType === 'directional') {
        directions = Array(combinationLength).fill('up');
      } else {
        userInput = '';
      }
    }
  }
</script>

<div class="flex flex-col items-center w-full mt-2">
  {#if isCorrect !== true}
    {#if inputType === 'directional'}
      <div class="flex items-center justify-center gap-4 mb-2">
        {#each Array(combinationLength) as _, i}
          <button
            on:click={() => rotateArrow(i)}
            class="w-16 h-16 bg-gray-800 border-2 border-gray-600 rounded-lg flex items-center justify-center focus:outline-none focus:border-red-500"
            aria-label={`Direction ${i + 1}, currently ${directions[i]}`}
          >
            <svg
              class="w-10 h-10 text-white transition-transform duration-300 ease-in-out"
              style="transform: rotate({rotationMap[directions[i]]}deg);"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        {/each}
      </div>
    {:else}
      <input
        id="codeInput"
        type={inputType}
        bind:value={userInput}
        placeholder="---"
        maxlength={maxLength}
        class="bg-gray-800 border-2 border-gray-600 text-white text-4xl text-center w-36 py-3 rounded-lg mb-0 tracking-[0.3em] focus:outline-none focus:border-red-500"
        on:keyup={handleKeyUp}
      />
    {/if}
  {/if}

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
        <div class="flex items-center gap-2 text-xl font-bold text-green-400 mt-2">
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
    class="h-6 text-red-500 transition-opacity duration-300"
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
