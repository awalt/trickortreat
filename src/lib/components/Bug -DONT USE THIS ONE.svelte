<script>
    import { onMount, onDestroy } from "svelte";
    import { fade } from "svelte/transition";
    import SubmitButton from "./SubmitButton.svelte";
    import { gameStore } from "$lib/gameStore.js";
    import Image from "svelte-image";

    // Import the BugController class from your new JS file.
    import BugController, { bugControllerManager } from "$lib/bugController.js";

    let spiderController;
    let patrolTimeoutId; // To store the ID of our setTimeout
    let isDestroyed = false; // Our "kill switch" for animation loops

    onMount(() => {
        isDestroyed = false; // Reset flag on mount
        spiderController = new BugController();
        spiderController.initialize({
            imageSprite: "spider-sprite.png",
            bugWidth: 69,
            bugHeight: 90,
            num_frames: 7,
            canFly: false,
            canDie: false,
            numDeathTypes: 2,
            zoom: 4,
            minDelay: 4000,
            maxDelay: 4000,
            minSpeed: 6,
            maxSpeed: 6,
            minBugs: 1,
            maxBugs: 1,
        });

        const spider = spiderController.bugs[0];

        // Refactored to use requestAnimationFrame for non-blocking animation
        async function walkTo(bugInstance, target) {
            return new Promise((resolve) => {
                let animationFrameId;

                function step() {
                    // --- ADDED CHECK ---
                    // If component is gone, stop the animation.
                    if (isDestroyed) {
                        cancelAnimationFrame(animationFrameId);
                        resolve();
                        return;
                    }

                    const pos = bugInstance.getPos();
                    // If bug is gone, stop the animation.
                    if (!pos) {
                        cancelAnimationFrame(animationFrameId);
                        resolve();
                        return;
                    }

                    const dx = target.x - pos.left;
                    const dy = target.y - pos.top;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // If we've reached the target, stop the animation.
                    if (distance < 15) {
                        cancelAnimationFrame(animationFrameId);
                        resolve();
                    } else {
                        // Otherwise, update the angle and request the next frame.
                        bugInstance.angle_deg =
                            -Math.atan2(dy, dx) * (180 / Math.PI);
                        bugInstance.angle_rad = bugInstance.deg2rad(
                            bugInstance.angle_deg,
                        );
                        animationFrameId = requestAnimationFrame(step);
                    }
                }

                // Start the animation loop
                animationFrameId = requestAnimationFrame(step);
            });
        }

        // Refactored to use requestAnimationFrame to wait for spider non-blockingly
        async function setSpiderPosition(x, y) {
            return new Promise((resolve) => {
                let animationFrameId;

                function check() {
                    // --- ADDED CHECK ---
                    if (isDestroyed) {
                        cancelAnimationFrame(animationFrameId);
                        resolve(); // Resolve to prevent any pending .then() from hanging
                        return;
                    }

                    // If spider is ready, set position and stop polling.
                    if (spider && spider.bug) {
                        cancelAnimationFrame(animationFrameId);
                        spider.setPos(y, x);
                        resolve();
                    } else {
                        // Otherwise, wait for the next frame to check again.
                        animationFrameId = requestAnimationFrame(check);
                    }
                }

                // Start polling
                animationFrameId = requestAnimationFrame(check);
            });
        }

        // Refactored to a non-blocking, recursive loop with requestAnimationFrame
        async function spiderPatrol() {
            if (isDestroyed) return; // Check at the very beginning

            const leftX = window.innerWidth * 0.2;
            const rightX = window.innerWidth * 0.8;
            const topY = window.innerHeight * 0.2;
            const startY =
                window.innerHeight - spiderController.options.bugHeight; // On-screen bottom
            const offscreenTopY = -spiderController.options.bugHeight; // Off-screen top

            // Define the patrol sequence
            const patrolPoints = [
                { x: leftX, y: topY }, // 1. Walk UP to top-left
                { x: rightX, y: topY }, // 2. Walk RIGHT to top-right
                { x: rightX, y: startY }, // 3. Walk DOWN to bottom-right
                { x: leftX, y: startY }, // 4. Walk LEFT to bottom-left
                { x: leftX, y: offscreenTopY }, // 5. Walk UP and exit
            ];

            // Recursive function to handle the patrol loop
            async function executePatrol(index) {
                // --- ADDED CHECK ---
                if (isDestroyed) return;

                // When the sequence is done, reset and start over.
                if (index >= patrolPoints.length) {
                    // Reset position to start for a seamless loop
                    await setSpiderPosition(leftX, startY);
                    if (isDestroyed) return; // Check again after await
                    // Use requestAnimationFrame to yield to the main thread before restarting
                    requestAnimationFrame(() => executePatrol(0));
                    return;
                }

                const point = patrolPoints[index];
                await walkTo(spider, point);

                if (isDestroyed) return; // Check again after await
                // Use requestAnimationFrame to yield before the next step
                requestAnimationFrame(() => executePatrol(index + 1));
            }

            // Start the initial patrol sequence
            await setSpiderPosition(leftX, startY);
            if (isDestroyed) return; // Check again after await
            spider.go();
            executePatrol(0);
        }

        // Start the patrol after a delay
        patrolTimeoutId = setTimeout(spiderPatrol, 2000);
    });

    // --- === UPDATED onDestroy BLOCK === ---
    onDestroy(() => {
        // 1. Set the flag to stop all our custom animation loops (patrol, etc.)
        isDestroyed = true;

        // 2. Clear the initial timeout in case we navigate away before it fires
        clearTimeout(patrolTimeoutId);

        // 3. Call the global manager's killAll() method. This is what you
        // had originally, and it's the correct way to stop the bugs'
        // internal animations and remove them from the DOM.
        bugControllerManager.killAll();
        spiderController.killAll();
    });
    // --- =============================== ---

    const correctAnswer = ["up", "right", "down", "left", "up"];
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
