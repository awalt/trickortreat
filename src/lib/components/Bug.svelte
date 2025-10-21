<script>
    import { onMount, onDestroy } from "svelte";
    import { fade } from "svelte/transition";
    import SubmitButton from "./SubmitButton.svelte";
    import Timer from "$lib/components/Timer.svelte";
    import { gameStore } from "$lib/gameStore.js";
    import Image from "svelte-image";

    // Import the BugController class from your new JS file.
    import BugController, { bugControllerManager } from "$lib/bugController.js";

    let spiderController;

    onMount(() => {
        spiderController = new BugController();
        spiderController.initialize({
            imageSprite: "spider-sprite.png",
            bugWidth: 69,
            bugHeight: 90,
            num_frames: 7,
            canFly: false,
            canDie: false,
            numDeathTypes: 2,
            zoom: 6,
            minDelay: 200,
            maxDelay: 1000,
            minSpeed: 6,
            maxSpeed: 13,
            minBugs: 1,
            maxBugs: 1,
        });

        const spider = spiderController.bugs[0];

        async function walkTo(bugInstance, target) {
            return new Promise((resolve) => {
                const interval = setInterval(() => {
                    const pos = bugInstance.getPos();
                    if (!pos) {
                        clearInterval(interval);
                        resolve();
                        return;
                    }

                    const dx = target.x - pos.left;
                    const dy = target.y - pos.top;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 15) {
                        clearInterval(interval);
                        resolve();
                    } else {
                        bugInstance.angle_deg =
                            -Math.atan2(dy, dx) * (180 / Math.PI);
                        bugInstance.angle_rad = bugInstance.deg2rad(
                            bugInstance.angle_deg,
                        );
                    }
                }, 50);
            });
        }

        async function setSpiderPosition(x, y) {
            return new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (spider && spider.bug) {
                        clearInterval(interval);
                        spider.setPos(y, x);
                        resolve();
                    }
                }, 50);
            });
        }

        async function spiderPatrol() {
            const leftX = window.innerWidth * 0.2;
            const rightX = window.innerWidth * 0.8;
            const topY = window.innerHeight * 0.2;
            const startY =
                window.innerHeight - spiderController.options.bugHeight; // On-screen bottom
            const offscreenTopY = -spiderController.options.bugHeight; // Off-screen top

            while (true) {
                // Start at bottom left, on screen
                await setSpiderPosition(leftX, startY);
                spider.go();

                // 1. Walk UP to the top-left
                await walkTo(spider, { x: leftX, y: topY });

                // 2. Walk RIGHT to the top-right
                await walkTo(spider, { x: rightX, y: topY });

                // 3. Walk DOWN to the bottom-right (on-screen)
                await walkTo(spider, { x: rightX, y: startY });

                // 4. Walk LEFT to the bottom-left (on-screen)
                await walkTo(spider, { x: leftX, y: startY });

                // 5. Walk UP and exit at the top edge
                await walkTo(spider, { x: leftX, y: offscreenTopY });
            }
        }

        setTimeout(spiderPatrol, 2000);
    });

    onDestroy(() => {
        if (typeof spiderController != "undefined") {
            bugControllerManager.killAll();
        }
    });

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

<div class="w-full text-center">
    <Timer />
</div>

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
