<script>
    import { gameStore } from "$lib/gameStore.js";
    import { moodMusic, preloadAllSounds, clickSound } from "$lib/audio.js";
    import {
        preloadAllVideos,
        preloadVideos,
        getVideoLoadingProgress,
    } from "$lib/video.js";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { TEXT } from "$lib/i18n.js";

    let showInfoModal = false;
    let isPreloading = false;
    let preloadProgress = 0;
    let loadingText = "Start";
    let isFadingToBlack = false;
    let showLoadingSpinner = false;

    // This promise will hold the state of our critical video preloading.
    let criticalVideosPreloadPromise;

    // Preload sounds immediately
    preloadAllSounds();

    async function handleStart() {
        if (isPreloading) return;

        clickSound.play();
        if (!moodMusic.playing()) {
            moodMusic.play();
        }

        // Start fading to black
        isFadingToBlack = true;
        isPreloading = true;

        // After 2 seconds, show loading spinner if still loading
        const spinnerTimeout = setTimeout(() => {
            if (isPreloading) {
                showLoadingSpinner = true;
            }
        }, 2000);

        try {
            // Wait for the preloading that we started in onMount to complete.
            // If it's already done, this will resolve immediately.
            await criticalVideosPreloadPromise;

            console.log("Critical videos preloaded successfully");
        } catch (error) {
            console.warn("Some videos failed to preload:", error);
        }

        // Clear the timeout if loading finished
        clearTimeout(spinnerTimeout);
        isPreloading = false;

        // Per request, removed the minimum 2-second wait to proceed immediately
        // after preloading, even if the fade animation is not complete.

        // Enter fullscreen
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            /* IE/Edge */
            elem.msRequestFullscreen();
        }

        gameStore.startGame();
    }

    function toggleInfoModal() {
        showInfoModal = !showInfoModal;
    }

    onMount(() => {
        document.body.style.overflow = "hidden";

        // Start preloading critical videos as soon as the component is mounted.
        criticalVideosPreloadPromise = preloadVideos([
            "doorScene",
            "videoTransition",
        ]);

        // Also start preloading other videos in the background.
        preloadVideos(["jumpScare"]);

        // We can add a catch here to log any preloading errors that happen before the user clicks start.
        criticalVideosPreloadPromise.catch((error) => {
            console.warn(
                "Initial video preload failed in the background:",
                error,
            );
        });

        return () => {
            document.body.style.overflow = "auto";
        };
    });
</script>

<div
    class="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden p-4"
    in:fade={{ duration: 500 }}
>
    <video
        class="absolute top-0 left-0 w-full h-full object-cover"
        src="/housestatic.mp4"
        autoplay
        muted
        playsinline
        on:canplaythrough={() => gameStore.setIntroVideoReady()}
    >
        Your browser does not support the video tag.
    </video>

    <div class="absolute top-0 left-0 w-full h-full"></div>

    {#if !$gameStore.introVideoReady}
        <div
            class="relative z-10 flex flex-col items-center w-full max-w-4xl p-8 animate-pulse"
            transition:fade={{ duration: 300 }}
        >
            <div class="w-full">
                <!-- Skeleton Title -->
                <div
                    class="h-px bg-gradient-to-r from-transparent via-orange-900/50 to-transparent mb-4 landscape:hidden"
                ></div>
                <div
                    class="h-16 md:h-20 bg-gray-800/50 rounded-lg w-4/5 mx-auto"
                ></div>
                <div
                    class="h-px bg-gradient-to-r from-transparent via-orange-900/50 to-transparent mt-4 landscape:hidden"
                ></div>

                <!-- Skeleton Tagline -->
                <div
                    class="h-7 bg-gray-800/50 rounded-md w-3/5 mx-auto mt-6"
                ></div>
            </div>

            <div class="flex flex-col items-center mt-8 landscape:mt-4">
                <!-- Skeleton Headphones -->
                <div class="h-5 bg-gray-800/50 rounded-md w-48 mb-4"></div>
                <!-- Skeleton Button -->
                <div class="h-12 bg-gray-800/50 rounded-lg w-40"></div>

                <!-- Skeleton Footer -->
                <div
                    class="mt-12 pt-8 border-t border-gray-700/30 w-full max-w-md"
                >
                    <div
                        class="h-4 bg-gray-800/50 rounded-md w-3/4 mx-auto"
                    ></div>
                </div>
            </div>
        </div>
    {/if}

    {#if $gameStore.introVideoReady}
        <div
            class="relative z-10 flex flex-col items-center w-full max-w-4xl p-8"
            in:fade={{ delay: 200, duration: 2000 }}
        >
            <div class=" w-full">
                <div class="">
                    <div
                        class="h-px bg-gradient-to-r from-transparent via-orange-700 to-transparent mb-4 landscape:hidden"
                    ></div>
                    <h1
                        class="text-6xl md:text-8xl landscape:text-5xl font-bold mb-4 landscape:mb-0 tracking-wider uppercase"
                        style="font-family: 'Creepster', cursive; text-shadow: 0 0 15px #ff6600, 0 0 25px #ff6600;"
                    >
                        {@html TEXT.title}
                    </h1>
                    <div
                        class="h-px bg-gradient-to-r from-transparent via-orange-700 to-transparent mt-4 landscape:hidden"
                    ></div>
                </div>

                <div class="">
                    <p
                        class="font-sans text-xl my-4 tracking-widest font-bold
                       text-gray-200
                       animate-flicker text-center"
                    >
                        {TEXT.tagline}
                    </p>
                </div>
            </div>

            <div class="flex flex-col items-center mt-8 landscape:mt-4">
                <div
                    class="flex items-center gap-2 text-white/50 text-xs font-sans tracking-wider uppercase mb-4"
                    in:fade={{ delay: 1000, duration: 2000 }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                        fill="none"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M7.11 12.822c-2.55.684-4.29 1.378-3.376 4.787.913 3.41 2.766 3.141 5.317 2.458l-.97-3.622zm9.78 0c2.55.684 4.29 1.378 3.376 4.787-.913 3.41-2.766 3.141-5.317 2.458l.97-3.622zm2.429.912a7.75 7.702 0 0 0-2.72-8.732 7.75 7.702 0 0 0-9.198 0 7.75 7.702 0 0 0-2.72 8.732"
                        ></path>
                    </svg>
                    <span>{TEXT.headphones_recommended}</span>
                </div>

                <button
                    on:click={handleStart}
                    class="relative inline-block px-10 py-3 font-bold text-lg text-white uppercase tracking-widest transition-all duration-300
                       bg-black/50 border border-orange-800/50 rounded-tl-xl rounded-br-xl
                       hover:border-orange-600 hover:shadow-[0_0_20px_rgba(255,110,50,0.5)] hover:scale-110"
                >
                    {TEXT.start}
                </button>

                <div class="mt-12 pt-8 border-t border-gray-700/30 mb-3">
                    <p class="text-gray-400 text-sm">
                        <button
                            on:click={toggleInfoModal}
                            class="text-orange-400 hover:text-orange-300 underline transition-colors duration-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            aria-label={TEXT.intro.footer_aria_label}
                        >
                            {TEXT.intro.footer_button_text}
                        </button>
                        {TEXT.intro.footer_text_1}
                        <a
                            href="https://www.mobileescapes.ca/about-us"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 underline transition-colors duration-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            {TEXT.intro.mobile_escapes}
                        </a>
                        {TEXT.intro.footer_text_2}
                        <svg
                            class="inline-block h-3.5 w-3.5"
                            viewBox="0 0 64 64"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            aria-hidden="true"
                            role="img"
                            preserveAspectRatio="xMidYMid meet"
                            ><path
                                d="M22.625 2c0 15.834-8.557 30-20.625 30c12.068 0 20.625 14.167 20.625 30c0-15.833 8.557-30 20.625-30c-12.068 0-20.625-14.166-20.625-30"
                                fill="currentColor"
                            ></path><path
                                d="M47 32c0 7.918-4.277 15-10.313 15C42.723 47 47 54.084 47 62c0-7.916 4.277-15 10.313-15C51.277 47 47 39.918 47 32z"
                                fill="currentColor"
                            ></path><path
                                d="M51.688 2c0 7.917-4.277 15-10.313 15c6.035 0 10.313 7.084 10.313 15c0-7.916 4.277-15 10.313-15c-6.036 0-10.313-7.083-10.313-15"
                                fill="currentColor"
                            ></path></svg
                        >
                        .
                    </p>
                </div>
            </div>
        </div>
    {/if}

    {#if showInfoModal}
        <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            on:click|self={toggleInfoModal}
            transition:fade={{ duration: 300 }}
        >
            <div
                class="bg-gray-900/80 border border-orange-500/50 rounded-lg shadow-xl p-8 max-w-lg w-full relative text-white animate-grow-shrink"
            >
                <button
                    on:click={toggleInfoModal}
                    class="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close modal"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <div class="flex flex-col items-center mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8 mb-2 text-orange-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h2 class="text-2xl font-bold text-orange-400 text-center">
                        Game Info
                    </h2>
                </div>

                <div class="text-gray-300 space-y-4">
                    <p>
                        {TEXT.intro.info1}
                    </p>
                    <p>
                        {TEXT.intro.info2}
                    </p>
                </div>

                <div class="mt-8 text-right">
                    <button
                        on:click={toggleInfoModal}
                        class="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    {/if}

    <!-- Fade to black overlay -->
    {#if isFadingToBlack}
        <div
            class="fixed inset-0 z-50 bg-black flex items-center justify-center"
            in:fade={{ duration: 2000 }}
        >
            {#if showLoadingSpinner}
                <div
                    class="flex flex-col items-center gap-4"
                    in:fade={{ duration: 300 }}
                >
                    <div
                        class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"
                    ></div>
                    <p class="text-white/70 text-sm tracking-wider">
                        Loading experience...
                    </p>
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    /* This custom animation creates a slow, subtle pulse for the text-shadow,
       giving the tagline a "glowing ember" effect.
   */
    @keyframes flicker {
        0%,
        100% {
            text-shadow:
                0 0 6px rgba(245, 158, 11, 0.5),
                0 0 12px rgba(245, 158, 11, 0.3);
        }
        50% {
            text-shadow:
                0 0 10px rgba(251, 191, 36, 0.6),
                0 0 20px rgba(251, 191, 36, 0.4);
        }
    }

    .animate-flicker {
        animation: flicker 4s ease-in-out infinite;
    }

    @keyframes grow-shrink {
        0% {
            transform: scale(0.7);
            opacity: 0;
        }
        80% {
            transform: scale(1.05);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    .animate-grow-shrink {
        animation: grow-shrink 0.4s ease-out forwards;
    }
</style>
