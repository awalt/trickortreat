<script>
  import { register } from 'swiper/element/bundle';
  import { onMount } from 'svelte';

  register();

  import { gameStore } from '$lib/gameStore.js';
  import { clickSound, successSound, errorSound } from '$lib/audio.js';
  import { fade } from 'svelte/transition';

  let userInput = '';
  let errorMessage = '';
  const correctAnswer = '123';

  let swiperEl;

  onMount(() => {
    if (swiperEl) {
      const swiperParams = {
        zoom: {
          maxRatio: 3,
          minRatio: 1,
        },
        navigation: true,
        initialSlide: 1,
      };
      Object.assign(swiperEl, swiperParams);
      swiperEl.initialize();
    }
  });

  async function checkAnswer() {
    clickSound.play();
    errorMessage = '';

    if (userInput === correctAnswer) {
      successSound.play();
      setTimeout(() => {
        gameStore.solvePuzzle('puzzle2');
      }, 500);
    } else {
      errorSound.play();
      errorMessage = 'Incorrect Code. Try Again.';
      userInput = '';

      const inputEl = document.querySelector('#codeInput');
      if (inputEl) {
        inputEl.classList.add('shake');
        setTimeout(() => inputEl.classList.remove('shake'), 500);
      }
    }
  }
</script>

<div class="w-full h-full flex flex-col items-center justify-center px-0 py-4 sm:p-8 text-center bg-gray-900"
  in:fade={{ duration: 1000 }}>

  <h1 class="text-6xl mb-4 font-creepster text-red-500" >
    Title Here
  </h1>

  <div class="w-full sm:max-w-md">
    <swiper-container init="false" bind:this={swiperEl}>

      <swiper-slide>
        <div class="w-full aspect-square flex flex-col items-center justify-center">
          <div class="swiper-zoom-container">
            <img src="/window.png" alt="Window" class="max-h-full max-w-full object-contain">
          </div>
          <p class="text-3xl mt-3 font-creepster text-gray-300" style="text-shadow: 1px 1px 3px #000;">Window</p>
        </div>
      </swiper-slide>

       <swiper-slide>
        <div class="w-full aspect-square flex flex-col items-center justify-center">
          <div class="swiper-zoom-container">
            <img src="/door.png" alt="Door" class="max-h-full max-w-full object-contain">
          </div>
          <p class="text-3xl mt-3 font-creepster text-gray-300" style="text-shadow: 1px 1px 3px #000;">Door1</p>
        </div>
      </swiper-slide>
       <swiper-slide>
        <div class="w-full aspect-square flex flex-col items-center justify-center">
          <div class="swiper-zoom-container">
            <img src="/door2.png" alt="Door" class="max-h-full max-w-full object-contain">
          </div>
          <p class="text-3xl mt-3 font-creepster text-gray-300" style="text-shadow: 1px 1px 3px #000;">Door2</p>
        </div>
      </swiper-slide>
       <swiper-slide>
        <div class="w-full aspect-square flex flex-col items-center justify-center">
          <div class="swiper-zoom-container">
            <img src="/door3.png" alt="Door" class="max-h-full max-w-full object-contain">
          </div>
          <p class="text-3xl mt-3 font-creepster text-gray-300" style="text-shadow: 1px 1px 3px #000;">Door3</p>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="w-full aspect-square flex flex-col items-center justify-center">
          <div class="swiper-zoom-container">
            <img src="/door4.png" alt="Door" class="max-h-full max-w-full object-contain">
          </div>
          <p class="text-3xl mt-3 font-creepster text-gray-300" style="text-shadow: 1px 1px 3px #000;">Door4</p>
        </div>
      </swiper-slide>

      <swiper-slide>
        <div class="w-full aspect-square flex flex-col items-center justify-center">
          <div class="swiper-zoom-container">
            <img src="/mailbox.png" alt="Mailbox" class="max-h-full max-w-full object-contain">
          </div>
          <p class="text-3xl mt-3 font-creepster text-gray-300" style="text-shadow: 1px 1px 3px #000;">Mailbox</p>
        </div>
      </swiper-slide>

    </swiper-container>
  </div>


  <div class="flex flex-col items-center mt-8">
    <input id="codeInput" type="number" bind:value={userInput} placeholder="---" maxlength="3"
      class="bg-gray-800 border-2 border-gray-600 text-white text-4xl text-center w-36 py-3 rounded-lg tracking-[0.3em] focus:outline-none focus:border-red-500"
      on:input={() => { if (userInput.length > 3) userInput = userInput.slice(0, 3); }} />
      
    <button on:click={checkAnswer}
      class="mt-6 bg-red-900 hover:bg-red-800 border-2 border-red-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-all duration-300 shadow-lg shadow-red-900/50 hover:shadow-red-800/70 hover:scale-105 active:scale-100">
      ENTER
    </button>

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

  .shake {
    animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
    transform: translate3d(0, 0, 0);
  }

  @keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
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