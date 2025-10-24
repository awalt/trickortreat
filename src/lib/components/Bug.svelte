<script>
    import { onMount, onDestroy } from "svelte";
    import { fade } from "svelte/transition";
    import SubmitButton from "./SubmitButton.svelte";
    import { gameStore } from "$lib/gameStore.js";
    import Image from "svelte-image";

    // Import the BugController class from your new JS file.
    import Spider from "./Spider.svelte";

    const correctAnswer = ["up", "right", "up", "left", "up"];
    let isCorrect = null;

    function checkAnswer(event) {
        const submittedCombination = event.detail;
        if (!submittedCombination) return;
        isCorrect =
            JSON.stringify(submittedCombination) ===
            JSON.stringify(correctAnswer);
    }

    function handleContinue() {
        gameStore.solvePuzzle();
    }
</script>

<Spider />
<div
    class="relative w-full flex flex-col items-center justify-center p-8 text-center bg-black min-h-screen"
    style="background-image: url('/wood.png'); background-size: cover; background-position: center;"
    in:fade={{ duration: 1000 }}
>
    <div class="z-10">
        <div class="sticky top-8">
            <h1 class="text-5xl md:text-2xl mb-4 font-serif text-yellow-400">
                Peephole
            </h1>

            <enhanced:img
                src="/static/path6.png"
                alt="A winding path"
                class="w-full h-auto mx-auto max-w-2xl"
            />

            <p class="mt-6">Unlock Doorbell</p>
            <SubmitButton
                {isCorrect}
                inputType="directional"
                combinationLength={5}
                on:submit={checkAnswer}
                on:continue={handleContinue}
            />
        </div>
    </div>
</div>

<style>
    /* Add this block */
    :global(body) {
        overflow-x: hidden;
    }

    :global(.bug) {
        pointer-events: none;
        z-index: 50; /* Ensure bugs are on top of other content if needed */
    }
</style>
