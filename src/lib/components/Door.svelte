<script>
    /*Puzzle1.svelte*/
    import { register } from "swiper/element/bundle";
    import { onMount, onDestroy } from "svelte";
    import SubmitButton from "./SubmitButton.svelte";

    register();

    import { gameStore } from "$lib/gameStore.js";
    import { warningSound } from "$lib/audio.js";
    import { fade } from "svelte/transition";

    const correctAnswer = "341";
    let isCorrect = null;

    let swiperEl;
    let signSlideVisited = false;

    onDestroy(() => {
        warningSound.pause();
        warningSound.currentTime = 0;
    });

    onMount(async () => {
        if (swiperEl) {
            const swiperParams = {
                navigation: true,
                initialSlide: 2,
            };
            Object.assign(swiperEl, swiperParams);

            await swiperEl.initialize();

            swiperEl.swiper.on("slideChange", () => {
                if (swiperEl.swiper.activeIndex === 1 && !signSlideVisited) {
                    warningSound.play();
                    signSlideVisited = true;
                }
            });
        }
    });

    // The user's input is now passed in the event detail
    function checkAnswer(event) {
        const submittedInput = event.detail;
        if (!submittedInput) return;
        isCorrect = submittedInput == correctAnswer;
    }

    function handleContinue() {
        gameStore.solvePuzzle("puzzle2");
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
                <div
                    class="w-full aspect-square flex flex-col items-center justify-center"
                >
                    <enhanced:img
                        src="/static/window5b.jpeg"
                        alt="Window"
                        class="max-h-full max-w-full object-contain"
                    />
                    <p
                        class="text-3xl mt-3 font-creepster text-gray-300"
                        style="text-shadow: 1px 1px 3px #000;"
                    >
                        Window
                    </p>
                </div>
            </swiper-slide>

            <swiper-slide>
                <div
                    class="w-full aspect-square flex flex-col items-center justify-center"
                >
                    <enhanced:img
                        src="/static/sign.jpeg"
                        alt="Sign"
                        class="max-h-full max-w-full object-contain"
                    />
                    <p
                        class="text-3xl mt-3 font-creepster text-gray-300"
                        style="text-shadow: 1px 1px 3px #000;"
                    >
                        Sign
                    </p>
                </div>
            </swiper-slide>
            <swiper-slide>
                <div
                    class="w-full aspect-square flex flex-col items-center justify-center"
                >
                    <enhanced:img
                        src="/static/house3d.png"
                        alt="Door"
                        class="max-h-full max-w-full object-contain"
                    />
                    <p
                        class="text-3xl mt-3 font-creepster text-gray-300"
                        style="text-shadow: 1px 1px 3px #000;"
                    >
                        Door
                    </p>
                </div>
            </swiper-slide>
        </swiper-container>
    </div>

    <div class="flex flex-col items-center mt-4">
        <p>Unlock Peephole</p>
        <SubmitButton
            {isCorrect}
            maxLength={3}
            inputType="number"
            on:submit={checkAnswer}
            on:continue={handleContinue}
        />
    </div>
</div>

<style>
    .font-creepster {
        font-family: "Creepster", cursive;
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
