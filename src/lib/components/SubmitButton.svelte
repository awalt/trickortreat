<script>
  import { createEventDispatcher } from 'svelte';

  export let isCorrect = false;
  export let isShaking = false;
  export let continueLabel = 'Continue';

  const dispatch = createEventDispatcher();

  function handleSubmit() {
    dispatch('submit');
  }

  function handleContinue() {
    dispatch('continue');
  }
</script>

<div class="flex flex-col items-center mt-8">
  {#if !isCorrect}
    <button
      on:click={handleSubmit}
      class="relative font-bold py-3 px-5 rounded-lg text-xl transition-all duration-300 shadow-lg flex items-center gap-2"
      class:shake={isShaking}
      class:bg-red-900={!isCorrect}
      class:hover:bg-red-800={!isCorrect}
      class:border-red-700={!isCorrect}
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
      <button
        class="bg-green-700 border-2 border-green-500 text-white font-bold py-3 px-3 rounded-lg text-xl shadow-lg shadow-green-700/50 flex items-center gap-2"
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
            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
          />
        </svg>
        <span>UNLOCKED</span>
      </button>
      <button
        on:click={handleContinue}
        class="mt-4 bg-blue-600 hover:bg-blue-500 border-2 border-blue-400 text-white font-bold py-2 px-6 rounded-lg text-lg transition-all duration-300 shadow-lg shadow-blue-600/50 hover:shadow-blue-500/70 hover:scale-105 active:scale-100"
      >
        {continueLabel}
      </button>
    </div>
  {/if}
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