<script>
    import { onMount, onDestroy } from "svelte";

    import { gameStore } from "$lib/gameStore.js";

    import {
        knockSound,
        buzzSound,
        creepyDoorSound,
        dingDongSound,
    } from "$lib/audio.js";

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    // --- Component State ---
    let knocks = [[], [], [], []];
    let isPlaying = false;
    let resultMessage = "";
    let resultMessageType = "";
    let playingCell = null;
    let houseFlicker = false;
    const correctPattern = "4132";

    onDestroy(() => {
        // Clean up sounds (timer cleanup is now handled by the GameTimer component)
        buzzSound.stop();
        knockSound.stop();
        creepyDoorSound.stop();
        dingDongSound.stop();
    });

    // --- Timer formatting function has been removed ---

    // --- Game Logic ---
    function handleKnock(rowIndex, colIndex) {
        if (isPlaying) return;
        if (resultMessage) {
            resultMessage = "";
        }
        knocks[rowIndex] = Array(colIndex + 1).fill(true);
        knocks = knocks;
    }

    async function handleSubmit() {
        isPlaying = true;
        resultMessage = "";
        const pattern = knocks.map((row) => row.length).join("");
        const lastKnockRowIndex = knocks
            .map((r) => r.length > 0)
            .lastIndexOf(true);

        for (const [rowIndex, row] of knocks.entries()) {
            if (row.length > 0) {
                for (let i = 0; i < row.length; i++) {
                    await playKnock(rowIndex, i);
                    await sleep(10);
                }
                if (rowIndex < lastKnockRowIndex) {
                    await sleep(400);
                }
            }
        }

        if (pattern === correctPattern) {
            resultMessage = "ACCESS GRANTED";
            resultMessageType = "correct";
        } else {
            resultMessage = "ACCESS DENIED";
            resultMessageType = "incorrect";
        }

        isPlaying = false;
    }

    function playKnock(rowIndex, colIndex) {
        return new Promise((resolve) => {
            knockSound.play();
            playingCell = { rowIndex, colIndex };

            setTimeout(() => {
                playingCell = null;
                resolve();
            }, 200);
        });
    }

    async function handleDoorbellRing() {
        if (isPlaying) return;
        isPlaying = true;
        dingDongSound.play();
        await sleep(2000);
        //buzzSound.play();
        //await sleep(1000);
        await playHouseFlickerPattern();
        isPlaying = false;
    }

    async function playHouseFlickerPattern() {
        const flickerDuration = 100;
        const shortPause = 250;
        const longPause = 800;

        for (const numStr of correctPattern) {
            const numFlickers = parseInt(numStr, 10);
            for (let i = 0; i < numFlickers; i++) {
                houseFlicker = true;
                buzzSound.play();
                await sleep(flickerDuration);
                houseFlicker = false;
                if (i < numFlickers - 1) await sleep(shortPause);
            }
            await sleep(longPause);
        }
    }

    function handleOpenDoorClick() {
        creepyDoorSound.play();
        gameStore.solvePuzzle();
    }

    function resetPattern() {
        if (isPlaying) return;
        knocks = [[], [], [], []];
        resultMessage = "";
        houseFlicker = false;
    }
</script>

<main
    class="door-background min-h-screen flex flex-col items-center justify-center p-4"
>
    <div class="relative max-w-lg mb-8">
        <h1 class="text-6xl mb-4 font-creepster text-red-500 text-center">
            Trick or Treat
        </h1>

        <enhanced:img
            src="/static/house3.jpeg"
            alt="House 3D"
            class="w-full object-contain"
            class:house-lightning-flicker={houseFlicker}
        />

        <div class="flex flex-col items-center mt-6">
            <p class="font-body text-amber-200/90 text-lg mb-2">
                Ring The Doorbell
            </p>
            <div class="doorbell-plate">
                <button
                    on:click={handleDoorbellRing}
                    disabled={isPlaying}
                    class="doorbell-button"
                ></button>
            </div>
        </div>
    </div>

    <div
        class="bg-[#5c3a21] border-8 border-[#3d2514] p-6 md:p-8 rounded-lg shadow-2xl shadow-black/60 text-center w-full max-w-md"
    >
        <h2
            class="text-2xl font-title text-amber-300/70 mb-1 uppercase tracking-wider engraved-text"
        >
            Front Door
        </h2>
        <h1
            class="text-4xl md:text-5xl font-title text-amber-300 mb-2 uppercase tracking-wider engraved-text"
        >
            Secret Knock
        </h1>
        <p class="font-body text-amber-200/70 mb-8">
            A specific pattern is required.
        </p>

        <div class="flex flex-col gap-3 mb-8">
            {#each { length: 4 } as _, rowIndex}
                <div class="grid grid-cols-4 gap-3">
                    {#each { length: 4 } as _, colIndex}
                        {@const isHighlighted = knocks[rowIndex]?.[colIndex]}
                        {@const isPlayingCell =
                            playingCell?.rowIndex === rowIndex &&
                            playingCell?.colIndex === colIndex}
                        <div
                            on:click={() => handleKnock(rowIndex, colIndex)}
                            class="w-full aspect-square flex items-center justify-center rounded-md transition-all duration-150 shadow-inner shadow-black/50"
                            class:cursor-pointer={!isPlaying}
                            class:cursor-not-allowed={isPlaying}
                            class:bg-black={!isHighlighted}
                            class:border-2={!isHighlighted}
                            class:border-black={!isHighlighted}
                            class:hover:border-amber-400={!isPlaying &&
                                !isHighlighted}
                            class:hover:bg-black={!isPlaying && !isHighlighted}
                            class:bg-amber-600={isHighlighted && !isPlayingCell}
                            class:border-amber-300={isPlayingCell}
                            class:scale-110={isPlayingCell}
                            class:shadow-lg={isPlayingCell}
                            class:shadow-amber-400={isPlayingCell}
                        >
                            <enhanced:img
                                src="/static/knocker.png"
                                alt="Knocker"
                                class="knocker-image w-2/3 h-2/3 object-contain opacity-50"
                                class:opacity-100={isHighlighted ||
                                    isPlayingCell}
                                class:animate-knock={isPlayingCell}
                            />
                        </div>
                    {/each}
                </div>
            {/each}
        </div>

        <div class="flex items-center justify-center gap-4">
            <button
                on:click={resetPattern}
                disabled={isPlaying}
                class="brass-button"
            >
                Reset
            </button>
            <button
                on:click={handleSubmit}
                disabled={isPlaying}
                class="brass-button px-8"
            >
                Knock
            </button>
        </div>

        <div class="mt-6 h-20 flex flex-col items-center justify-center">
            {#if resultMessage}
                <div
                    class="text-2xl font-title tracking-widest"
                    class:text-green-400={resultMessageType === "correct"}
                    class:text-red-500={resultMessageType === "incorrect"}
                >
                    {resultMessage}
                </div>
                {#if resultMessageType === "correct"}
                    <button
                        on:click={handleOpenDoorClick}
                        class="brass-button mt-4"
                    >
                        Open Door
                    </button>
                {/if}
            {/if}
        </div>
    </div>
</main>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=EB+Garamond&family=Creepster&display=swap");

    /* The timer's style has been moved to the GameTimer.svelte component */

    .font-title {
        font-family: "Cinzel Decorative", serif;
    }
    .font-creepster {
        font-family: "Creepster", cursive;
    }
    .font-body {
        font-family: "EB Garamond", serif;
    }

    .door-background {
        background-color: #3d2514;
        background-image:
            linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.4) 0%,
                rgba(0, 0, 0, 0) 50%,
                rgba(0, 0, 0, 0.4) 100%
            ),
            linear-gradient(
                90deg,
                #5c3a21 0px,
                #4a2e1a 4px,
                #4a2e1a 8px,
                #3d2514 12px
            );
        background-size:
            100%,
            12px 100%;
    }

    .engraved-text {
        text-shadow:
            1px 1px 0px #2a1b0e,
            2px 2px 2px rgba(0, 0, 0, 0.8);
    }

    .brass-button {
        @apply px-6 py-3 bg-yellow-800 text-amber-100 rounded-sm uppercase tracking-wider;
        @apply border-2 border-t-amber-500 border-l-amber-600 border-b-yellow-950 border-r-yellow-950;
        @apply font-title text-sm font-bold transition-all duration-150;
        @apply disabled:opacity-50 disabled:cursor-not-allowed;
    }
    .brass-button:not(:disabled):hover {
        @apply bg-yellow-700;
    }
    .brass-button:not(:disabled):active {
        @apply bg-yellow-900 border-t-yellow-950 border-l-yellow-950 border-b-amber-500 border-r-amber-600;
    }

    .doorbell-plate {
        width: 80px;
        height: 120px;
        background: linear-gradient(to bottom, #7a5230, #5c3a21);
        border: 3px solid #3d2514;
        border-radius: 8px;
        box-shadow:
            0px 5px 15px rgba(0, 0, 0, 0.6),
            inset 0px 0px 10px rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        margin-top: 10px;
    }

    .doorbell-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #ffd700, #b8860b);
        border: 3px solid #8b4513;
        box-shadow:
            0px 3px 6px rgba(0, 0, 0, 0.5),
            inset 0px 0px 3px rgba(255, 255, 255, 0.4);
        cursor: pointer;
        transition: all 0.1s ease-out;
    }

    .doorbell-button:hover:not(:disabled) {
        background: radial-gradient(circle at 30% 30%, #ffe766, #c8961b);
    }
    .doorbell-button:active:not(:disabled) {
        transform: translateY(2px);
        box-shadow:
            0px 1px 3px rgba(0, 0, 0, 0.5),
            inset 0px 0px 5px rgba(0, 0, 0, 0.4);
    }
    .doorbell-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    @keyframes knock-animation {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(0.9) rotate(-5deg);
        }
        100% {
            transform: scale(1);
        }
    }

    .animate-knock {
        animation: knock-animation 0.2s ease-in-out;
    }
    .house-lightning-flicker {
        filter: brightness(150%) saturate(150%);
        transition: filter 0.05s ease-out;
    }

    :global(.knocker-image) {
        display: block;
        margin: 0 auto;
    }
</style>
