<script>
    /* SubmitButton.svelte */
    import { createEventDispatcher, onMount, tick } from "svelte"; // Import tick
    import { successSound, errorSound } from "$lib/audio.js";
    import { TEXT } from "$lib/i18n"; // Already imported, good!
    // --- PROPS ---
    export let isCorrect = null;
    // UPDATED: Use default from TEXT store
    export let continueLabel = TEXT.submitButton.continue;
    export let inputType = "text";
    // 'text', 'number', or 'directional'
    export let maxLength = 3;
    export let combinationLength = 3;
    // For directional input

    // --- LOCAL STATE ---
    let userInput = "";
    // For text/number input
    let directions = [];
    // For directional input
    let attempt = -1;
    let isShaking = false;
    let errorMessage = "";
    const dispatch = createEventDispatcher();

    let submitButtonWrapper; // ADDED: To bind to our button container

    // Initialize directions array when the component mounts
    onMount(() => {
        if (inputType === "directional") {
            directions = Array(combinationLength).fill("up");
        }
    });
    // --- MAPPINGS ---
    const directionCycle = ["up", "right", "down", "left"];
    const rotationMap = {
        up: 0,
        right: 90,
        down: 180,
        left: 270,
    };
    // ADDED: Reactive map for translating aria-labels
    $: directionTranslationMap = {
        up: TEXT.submitButton.dir_up,
        right: TEXT.submitButton.dir_right,
        down: TEXT.submitButton.dir_down,
        left: TEXT.submitButton.dir_left,
    };
    // --- FUNCTIONS ---
    function rotateArrow(index) {
        const currentDirection = directions[index];
        const currentIndex = directionCycle.indexOf(currentDirection);
        const nextIndex = (currentIndex + 1) % directionCycle.length;
        directions[index] = directionCycle[nextIndex];
    }

    function handleSubmit() {
        const valueToSubmit =
            inputType === "directional" ? directions : userInput;
        if (inputType === "directional" || userInput) {
            attempt++;
            dispatch("submit", valueToSubmit);
        }
    }

    function handleContinue() {
        dispatch("continue");
    }

    function handleKeyUp(event) {
        if (event.key === "Enter") {
            handleSubmit();
        }
    }

    // ADDED: This function scrolls the button into view on mobile
    async function handleInputFocus() {
        // Wait for Svelte's next DOM update
        await tick();

        // Wait a moment for the keyboard to finish animating in
        setTimeout(() => {
            if (submitButtonWrapper) {
                submitButtonWrapper.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest", // Ensures it scrolls just enough
                });
            }
        }, 300); // 300ms delay is usually enough
    }

    // --- REACTIVE LOGIC ---
    $: if (attempt >= 0) {
        if (isCorrect) {
            successSound.play();
            // Assuming audio.js is external
            errorMessage = "";
            isShaking = false;
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        } else if (isCorrect === false) {
            errorSound.play();
            // Assuming audio.js is external
            // UPDATED: Use error message from TEXT store
            errorMessage = TEXT.submitButton.incorrect;
            isShaking = true;
            setTimeout(() => (isShaking = false), 500);

            // Reset input on failure
            if (inputType === "directional") {
                directions = Array(combinationLength).fill("up");
            } else {
                userInput = "";
            }
        }
    }
</script>

<div class="flex flex-col items-center w-full mt-2">
    <div class="flex items-center justify-center min-h-20">
        <div
            class="transition-opacity duration-300"
            class:opacity-0={isCorrect}
            class:pointer-events-none={isCorrect}
        >
            {#if inputType === "directional"}
                <div class="flex items-center justify-center gap-4">
                    {#each Array(combinationLength) as _, i}
                        <button
                            on:click={() => rotateArrow(i)}
                            class="flex items-center justify-center w-16 h-16 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                            aria-label={`${TEXT.submitButton.aria_direction} ${
                                i + 1
                            }, ${TEXT.submitButton.aria_currently} ${
                                directionTranslationMap[directions[i]]
                            }`}
                        >
                            <svg
                                class="w-10 h-10 text-white transition-transform duration-300 ease-in-out"
                                style="transform: rotate({rotationMap[
                                    directions[i]
                                ]}deg);"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 15l7-7 7 7"
                                />
                            </svg>
                        </button>
                    {/each}
                </div>
            {:else}
                <input
                    id="codeInput"
                    type={inputType}
                    bind:value={userInput}
                    placeholder="---"
                    maxlength={maxLength}
                    class="w-36 rounded-lg border-2 border-gray-600 bg-gray-800 py-3 text-center text-4xl text-white tracking-[0.3em] focus:border-red-500 focus:outline-none"
                    on:keyup={handleKeyUp}
                    on:focus={handleInputFocus}
                />
            {/if}
        </div>
    </div>

    <div
        bind:this={submitButtonWrapper}
        class="relative flex flex-col items-center justify-center w-full h-28"
    >
        <div
            class="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out"
            class:opacity-100={isCorrect}
            class:scale-100={isCorrect}
            class:opacity-0={!isCorrect}
            class:scale-90={!isCorrect}
            class:pointer-events-auto={isCorrect}
            class:pointer-events-none={!isCorrect}
        >
            <div
                class="flex items-center gap-2 text-xl font-bold text-lime-400"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="lock-icon h-6 w-6"
                    class:unlocked={isCorrect}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    overflow="visible"
                >
                    <g class="lock-shackle">
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </g>
                    <rect
                        class="lock-body"
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                    />
                </svg>
                <span>{TEXT.submitButton.unlocked}</span>
            </div>
            <button
                on:click={handleContinue}
                class="mt-4 rounded-lg border-2 border-lime-400 bg-lime-600 py-2 px-6 text-lg font-bold text-white shadow-lg shadow-lime-600/50 transition-all duration-300 hover:scale-105 hover:bg-lime-500 hover:shadow-lime-500/70 active:scale-100"
            >
                {continueLabel}
            </button>
        </div>

        <div
            class="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
            class:opacity-100={!isCorrect}
            class:opacity-0={isCorrect}
            class:pointer-events-auto={!isCorrect}
            class:pointer-events-none={isCorrect}
        >
            <button
                on:click={handleSubmit}
                class="relative flex items-center gap-2 rounded-lg py-3 px-5 text-xl font-bold text-white shadow-lg transition-all duration-300 border-2"
                class:shake={isShaking}
                class:border-red-700={!isCorrect}
                class:bg-red-900={!isCorrect}
                class:hover:bg-red-800={!isCorrect}
                class:hover:scale-105={!isCorrect}
                class:active:scale-100={!isCorrect}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="lock-icon h-6 w-6"
                    class:unlocked={isCorrect}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    overflow="visible"
                >
                    <g class="lock-shackle">
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </g>
                    <rect
                        class="lock-body"
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                    />
                </svg>
                <span>{TEXT.submitButton.enter}</span>
            </button>
        </div>
    </div>

    <p
        class="h-6 text-red-500 transition-opacity duration-300"
        class:animate-pulse={errorMessage}
        class:opacity-100={errorMessage}
        class:opacity-0={!errorMessage}
    >
        {errorMessage || ""}
    </p>
</div>

<style>
    .shake {
        animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        transform: translate3d(0, 0, 0);
    }

    @keyframes shake {
        10%,
        90% {
            transform: translate3d(-1px, 0, 0);
        }
        20%,
        80% {
            transform: translate3d(2px, 0, 0);
        }
        30%,
        50%,
        70% {
            transform: translate3d(-4px, 0, 0);
        }
        40%,
        60% {
            transform: translate3d(4px, 0, 0);
        }
    }

    /* --- New Lock Animation Styles --- */
    .lock-shackle {
        /* Set the point of rotation to the base of the left shackle arm */
        transform-origin: 7px 11px;
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    }

    .lock-icon.unlocked .lock-shackle {
        /* Swing the shackle open on the 'unlocked' class */
        transform: rotate(-25deg);
    }
</style>
