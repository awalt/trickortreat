<script>
    //THIS FILE: Timer.svelte
    import { onMount, onDestroy } from "svelte";
    import { gameStore } from "$lib/gameStore.js";

    // ✅ 1. NEW HELPER FUNCTION
    // This function runs immediately to get the correct initial time.
    function getInitialTime() {
        if (typeof window === "undefined") {
            return 0; // A safeguard for server-side rendering
        }

        const storedStartTime = localStorage.getItem("gameStartTime");
        const isRunning =
            localStorage.getItem("isGameTimerRunning") !== "false";

        if (isRunning && storedStartTime) {
            // If timer is active, calculate the current elapsed time
            const startTime = parseInt(storedStartTime, 10);
            return Math.floor((Date.now() - startTime) / 1000);
        } else {
            // If timer is stopped, get its final stored value
            const finalTime = localStorage.getItem("gameFinalTime");
            return finalTime ? parseInt(finalTime, 10) : 0;
        }
    }

    let startTime = 0;
    let elapsedTime = getInitialTime(); // ✅ 2. INITIALIZE WITH THE FUNCTION
    let timerInterval = null;
    let isRunning = true;

    // This function sets up the timer based on what's in localStorage.
    // It remains mostly the same, but now it starts with a non-zero elapsedTime.
    function initializeTimer() {
        // Clear any old interval to prevent memory leaks when resetting.
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        const runningStatus = localStorage.getItem("isGameTimerRunning");
        isRunning = runningStatus !== "false";

        const storedStartTime = localStorage.getItem("gameStartTime");
        if (storedStartTime) {
            startTime = parseInt(storedStartTime, 10);
        } else {
            startTime = 0; // Reset internal state if no start time is found.
        }

        if (isRunning && startTime > 0) {
            timerInterval = setInterval(() => {
                elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            }, 1000);
            // No need to set elapsedTime here, it's already correct from getInitialTime()
        } else if (!isRunning && startTime > 0) {
            const finalTime = localStorage.getItem("gameFinalTime");
            elapsedTime = finalTime ? parseInt(finalTime, 10) : 0;
        } else {
            // Auto-start the timer if it's not running and has no start time
            if (isRunning) {
                startTime = Date.now();
                localStorage.setItem("gameStartTime", startTime.toString());
                localStorage.setItem("isGameTimerRunning", "true");

                timerInterval = setInterval(() => {
                    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                }, 1000);
                elapsedTime = 0;
            } else {
                // If explicitly set to not running, display 0
                elapsedTime = 0;
            }
        }
    }

    onMount(() => {
        // Run the setup function when the component first loads.
        initializeTimer();

        // Listen for the custom 'reset-timer' event from the debug menu.
        window.addEventListener("reset-timer", initializeTimer);
    });

    onDestroy(() => {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        // IMPORTANT: Clean up the window event listener to prevent memory leaks.
        window.removeEventListener("reset-timer", initializeTimer);
    });

    // Formats seconds into a MM:SS display
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
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

    {#each formatTime(elapsedTime).split("") as char}
        <span class="digit" class:colon={char === ":"}>{char}</span>
    {/each}
</div>

<style>
    /* ✅ UPDATED ANIMATION FOR THE NEW BORDER */

    .timer-display {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;

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
