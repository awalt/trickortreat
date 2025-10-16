<script>
    import { gameStore } from "$lib/gameStore.js";
    import { fade, scale } from "svelte/transition";
    import { onMount, onDestroy } from "svelte";
    import { clickSound, courageSound, suspiciousSound } from "$lib/audio.js";

    let showModal = false;

    suspiciousSound.play();
    onDestroy(() => {
        suspiciousSound.pause();
        suspiciousSound.currentTime = 0;
    });
    function handleGoToDoor() {
        clickSound.play();
        gameStore.goToView("VideoTransition");
        //gameStore.solvePuzzle();
    }

    function handleRunAway() {
        suspiciousSound.pause();
        clickSound.play();
        courageSound.play();
        showModal = true;
    }

    function closeModal() {
        courageSound.stop();
        showModal = false;
    }

    onMount(() => {
        document.body.style.overflow = "hidden";
        // Stop the sound if the component is destroyed (e.g., user navigates away)
        return () => {
            courageSound.stop();
            document.body.style.overflow = "auto";
        };
    });
</script>

<div
    class="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden p-4"
    in:fade={{ duration: 1000 }}
>
    <video
        autoplay
        muted
        class="absolute top-0 left-0 w-full h-full object-cover z-0"
    >
        <source src="/houseopen.mp4" type="video/mp4" />
        Your browser does not support the video tag.
    </video>

    <div class="relative z-10">
        <div class="max-w-3xl mx-auto">
            <h1
                class="text-5xl md:text-2xl font-bold font-sans text-gray-200 text-shadow-lg mb-8"
            >
                Every other house on this street has been visited. Will&nbsp;you
                be its first trick or treater?
            </h1>
        </div>
        <div class="flex gap-4 justify-center">
            <button
                on:click={handleRunAway}
                class="relative inline-block px-10 py-3 font-bold text-lg text-white uppercase tracking-widest transition-all duration-300
                    bg-black/50 border border-orange-800/50 rounded-tl-xl rounded-br-xl
                    hover:border-orange-600 hover:shadow-[0_0_20px_rgba(255,110,50,0.5)] hover:scale-110"
            >
                <span class="animate-pulse">Run away</span>
            </button>
            <button
                on:click={handleGoToDoor}
                class="relative inline-block px-10 py-3 font-bold text-lg text-white uppercase
        tracking-widest transition-all duration-300
                    bg-black/50 border border-orange-800/50 rounded-tl-xl rounded-br-xl
                    hover:border-orange-600 hover:shadow-[0_0_20px_rgba(255,110,50,0.5)] hover:scale-110"
            >
                <span class="animate-pulse">Go to door</span>
            </button>
        </div>
    </div>
</div>

{#if showModal}
    <div
        transition:fade={{ duration: 200 }}
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
        <div
            in:scale={{ duration: 300, start: 0.9, opacity: 0 }}
            out:scale={{ duration: 200, start: 1, end: 0.9, opacity: 0 }}
            class="relative w-full max-w-lg p-8 bg-gradient-to-br from-gray-900 to-black/90 text-center

           border-2 border-orange-800/50 shadow-[0_0_30px_rgba(255,110,50,0.3)]"
        >
            <div
                class="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-orange-500"
            ></div>
            <div
                class="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-orange-500"
            ></div>
            <div
                class="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-orange-500"
            ></div>
            <div
                class="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-orange-500"
            ></div>

            <h2
                class="text-3xl font-creepster text-orange-400 mb-4 text-shadow-md"
            >
                You don't have the courage yet.
            </h2>
            <p class="text-gray-300 text-lg mb-8">Take a few deep breaths.</p>

            <button
                on:click={closeModal}
                class="relative inline-block px-10 py-3 font-bold text-lg text-white uppercase tracking-widest transition-all duration-300
             bg-black/50 border border-orange-800/50 rounded-tl-xl rounded-br-xl
             hover:border-orange-600 hover:shadow-[0_0_20px_rgba(255,110,50,0.5)] hover:scale-110"
            >
                OK
            </button>
        </div>
    </div>
{/if}
