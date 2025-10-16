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
    {#each formatTime(elapsedTime).split("") as char}
        <span class="digit" class:colon={char === ":"}>{char}</span>
    {/each}
</div>

<style>
    .timer-display {
        position: fixed;
        top: 1rem; /* 16px */
        right: 1.5rem; /* 24px */
        background-color: rgba(0, 0, 0, 0.7);
        color: #ffc700; /* Amber color */
        font-family: "Cinzel Decorative", serif;
        font-size: 1.875rem; /* text-3xl */
        padding: 0.5rem 1rem;
        border-radius: 0.375rem; /* rounded-md */
        border: 2px solid #b8860b; /* Dark gold/brass */
        box-shadow: 0 0 15px rgba(255, 199, 0, 0.5);
        z-index: 50; /* Ensures it stays on top of other content */
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
    }

    .digit {
        display: inline-block;
        width: 0.7em; /* Adjust this value if needed for the font */
        text-align: center;
    }

    .colon {
        width: 0.4em;
    }
</style>
