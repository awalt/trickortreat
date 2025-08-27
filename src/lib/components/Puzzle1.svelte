<script>
  import { register } from 'swiper/element/bundle';
  import { onMount, onDestroy } from 'svelte';
  import SubmitButton from './SubmitButton.svelte'; // Import the new component

  register();

  import { gameStore } from '$lib/gameStore.js';
  import { clickSound, successSound, errorSound, warningSound } from '$lib/audio.js';
  import { fade } from 'svelte/transition';

  let userInput = '';
  let errorMessage = '';
  const correctAnswer = '372';
  let isCorrect = false;
  let isShaking = false;

  let swiperEl;

  warningSound.play();

  onDestroy(() => {
    warningSound.pause();
    warningSound.currentTime = 0;
  });

  onMount(() => {
    if (swiperEl) {
      const swiperParams = {
        zoom: {
          maxRatio: 3,
          minRatio: 1,
        },
        navigation: true,
        initialSlide: 2,
      };
      Object.assign(swiperEl, swiperParams);
      swiperEl.initialize();
    }
  });

  async function checkAnswer() {
    clickSound.play();
    errorMessage = '';
    isShaking = false;

    if (userInput == correctAnswer) {
      successSound.play();
      isCorrect = true;
    } else {
      errorSound.play();
      errorMessage = 'Incorrect Code. Try Again.';
      userInput = '';
      isShaking = true;
      setTimeout(() => (isShaking = false), 500);
    }
  }

  function handleContinue() {
    gameStore.solvePuzzle('puzzle2');
  }
</script>

<div
  class="w-full min-h-screen flex flex-col items-center justify-center px-0 py-4 sm:p-8 text-center bg-gray-900"
  in:fade={{ duration: 1000 }}
>
  <h1 class="text-6xl mb-4 font-creepster text-red-500">Look around</h1>

  <div class="w-full sm:max-w-md">
    <swiper-container init="false" bind:this={swiperEl}>
      <swiper-slide>
        <div class="w-full aspect-square flex flex-col items-center justify-center">
          <div class="swiper-zoom-container">
            <img src="/window.png" alt="Window" class="max-h-full max-w-full object-contain" />
          </div>
          <p class="text-3xl mt-3 font-creepster text-gray-300" style="text-shadow: 1px 1px 3px #000;">
            Window
          </p>
        </div>
      </swiper-slide>

      <swiper-slide>
        <div class="w-full aspect-square flex flex-col items-center justify-center">
          <div class="swiper-zoom-container">
            <img src="/sign.jpeg" alt="Door" class="max-h-full max-w-full object-contain" />
          </div>
          <p class="text-3xl mt-3 font-creepster text-gray-300" style="text-shadow: 1px 1px 3px #000;">
            Sign
          </p>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="w-full aspect-square flex flex-col items-center justify-center">
          <div class="swiper-zoom-container">
            <img src="/house4.jpeg" alt="Door" class="max-h-full max-w-full object-contain" />
          </div>
          <p class="text-3xl mt-3 font-creepster text-gray-300" style="text-shadow: 1px 1px 3px #000;">
            Door
          </p>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="w-full aspect-square flex flex-col items-center justify-center">
          <div class="swiper-zoom-container">
            <img src="/mailbox2.jpeg" alt="Door" class="max-h-full max-w-full object-contain" />
          </div>
          <p class="text-3xl mt-3 font-creepster text-gray-300" style="text-shadow: 1px 1px 3px #000;">
            Mailbox
          </p>
        </div>
      </swiper-slide>
    </swiper-container>
  </div>

  <div class="flex flex-col items-center mt-8">
    <input
      id="codeInput"
      type="number"
      bind:value={userInput}
      placeholder="---"
      maxlength="3"
      class="bg-gray-800 border-2 border-gray-600 text-white text-4xl text-center w-36 py-3 rounded-lg tracking-[0.3em] focus:outline-none focus:border-red-500"
      on:input={() => {
        if (userInput.length > 3) userInput = userInput.slice(0, 3);
      }}
    />

    <SubmitButton {isCorrect} {isShaking} on:submit={checkAnswer} on:continue={handleContinue} />

    {#if errorMessage}
      <p class="text-red-500 mt-4 animate-pulse">{errorMessage}</p>
    {/if}
  </div>
</div>

<style>
  /* Import the new font by adding a font-family to your styles */
  .font-creepster {
    font-family: 'Creepster', cursive;
  }

  swiper-container {
    --swiper-navigation-color: #ffffff;
    --swiper-navigation-size: 22px;
  }

  :global(.swiper-button-prev),
  :global(.swiper-button-next) {
    background: rgba(0, 0, 0, 0.3);
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
</style>