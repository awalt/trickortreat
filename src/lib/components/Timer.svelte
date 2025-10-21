<script>
    // This file is: Timer.svelte
    // This is a simple display component that subscribes to the global `time` store.
    import { time } from "$lib/timerStore.js";
    import { onMount, onDestroy } from "svelte"; // Import onMount and onDestroy

    // --- CONSOLE LOGS ---
    onMount(() => {
        console.log("Timer.svelte: Component has been MOUNTED.");
    });

    onDestroy(() => {
        console.log("Timer.svelte: Component has been DESTROYED.");
    });

    // This reactive block will run every time the $time store changes.
    // This is how you can see the "tick".
    $: {
        console.log("Timer.svelte: Tick! New time value received:", $time);
    }
    // --- END CONSOLE LOGS ---

    /**
     * Formats a total number of seconds into a MM:SS string.
     * @param {number | unknown} seconds The total seconds to format.
     * @returns {string} The formatted time string (e.g., "01:23").
     */
    function formatTime(seconds) {
        // Guard against null, undefined, or NaN values during initialization.
        const validSeconds =
            typeof seconds === "number" && !isNaN(seconds) ? seconds : 0;
        const minutes = Math.floor(validSeconds / 60);
        const remainingSeconds = validSeconds % 60;
        const paddedMinutes = String(minutes).padStart(2, "0");
        const paddedSeconds = String(remainingSeconds).padStart(2, "0");
        return `${paddedMinutes}:${paddedSeconds}`;
    }
</script>

<div class="timer-display">
    <svg
        class="timer-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M5 22h14" />
        <path d="M5 2h14" />
        <path
            d="M17 2v2.34c0 1.5-1.12 2.72-2.5 3.16-1.38.44-2.5 1.66-2.5 3.16V14"
        />
        <path
            d="M7 2v2.34c0 1.5 1.12 2.72 2.5 3.16 1.38.44 2.5 1.66 2.5 3.16V14"
        />
        <path
            d="M7 22v-2.34c0-1.5 1.12-2.72 2.5-3.16 1.38-.44 2.5-1.66 2.5-3.16"
        />
        <path d="M17 22v-2.34c0-1.5-1.12-2.72-2.5-3.16-.9-.28-1.6-.8-2-1.4" />
        <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </svg>

    {#each formatTime($time).split("") as char}
        <span class="digit" class:colon={char === ":"}>{char}</span>
    {/each}
</div>

<style>
    .timer-display {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0 auto 1rem;
        font-family: "Creepster", cursive;
        font-size: 2rem;
        color: #f97316;
        background-color: rgba(10, 5, 0, 0.7);
        padding: 0.5rem 1rem;
        text-shadow:
            0 0 5px #000,
            0 0 10px #ef4444;
    }

    .timer-icon {
        width: 0.9em;
        height: 1em;
        filter: drop-shadow(0 0 8px #ef4444);
    }

    .digit {
        display: inline-block;
        width: 0.3em;
        text-align: center;
    }

    .colon {
        width: 0.4em;
        text-shadow: 0 0 5px #000;
        position: relative;
        top: -0.1em;
    }
</style>
