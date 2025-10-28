<script>
    import { gameStore } from "$lib/gameStore.js";
    import JumpScare from "$lib/components/JumpScare.svelte";
    import { fade } from "svelte/transition";
    import { onMount, onDestroy } from "svelte";
    import { congratsSound } from "$lib/audio.js";
    import { TEXT, FILE } from "$lib/i18n.js"; // <-- IMPORT ADDED

    let playJumpScare = false;

    // The timer in JumpScare.svelte is set to 550ms, plus a 100ms fade.
    // We use 750ms here to ensure the transition completes before navigating.
    const JUMPSCARE_DURATION = 750;

    function grabTheCandy() {
        if (playJumpScare) return;

        playJumpScare = true;

        // After the jump scare duration, automatically move to the Conclusion page.
        setTimeout(() => {
            gameStore.solvePuzzle(); // Moves from "Candy" to "Conclusion"
        }, JUMPSCARE_DURATION);
    }

    onMount(() => {
        congratsSound.play();
    });

    onDestroy(() => {
        // Stop the sound if the user navigates away before it finishes
        congratsSound.stop();
    });
</script>

<div
    class="relative w-full min-h-screen flex items-center justify-center p-8 text-center bg-gray-900"
    in:fade={{ duration: 1000 }}
>
    {#if playJumpScare}
        <JumpScare delay={0} />
    {/if}

    <div class="relative z-10 max-w-2xl mx-auto">
        <img
            src={FILE.candy}
            alt={TEXT.candy.alt_text}
            class="w-full h-auto max-w-2xl mx-auto mb-8"
            on:click={grabTheCandy}
        />

        <h1 class="text-4xl md:text-5xl font-creepster text-yellow-400 mb-4">
            {TEXT.candy.title}
        </h1>
        <p class="text-gray-300 text-xl mb-10">{TEXT.candy.subtitle}</p>

        <button
            on:click={grabTheCandy}
            disabled={playJumpScare}
            class="relative inline-block px-12 py-4 font-bold text-xl text-white uppercase tracking-widest transition-all duration-300
             bg-orange-600 border-4 border-yellow-400 rounded-full
             hover:bg-orange-700 hover:shadow-[0_0_30px_rgba(255,255,0,0.8)]
             hover:scale-110 disabled:opacity-50"
        >
            {TEXT.candy.button}
        </button>
    </div>
</div>

<style>
    .font-creepster {
        font-family: "Creepster", cursive;
    }
    :global(body) {
        overflow-x: hidden;
    }
</style>
