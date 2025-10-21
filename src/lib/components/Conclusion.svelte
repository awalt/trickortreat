<script>
    //This file is: Conclusion.svelte
    import { onMount } from "svelte";
    import { gameStore } from "$lib/gameStore.js";

    // finalTime is loaded from localStorage.
    let finalTime = "00:00";
    export let playerName = "";
    let finalTimeInSeconds = 0;

    let showNameInput = false;
    let isSubmitting = false;
    let nameSubmitted = false;

    let highscores = [
        { name: "SpookMaster", time: "03:45" },
        { name: "GhostHunter", time: "04:12" },
        { name: "PumpkinKing", time: "04:33" },
        { name: "WitchyWiz", time: "05:01" },
        { name: "BatSignal", time: "05:28" },
    ];

    // This helper function formats seconds into MM:SS
    function formatTimeFromSeconds(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const paddedMinutes = String(minutes).padStart(2, "0");
        const paddedSeconds = String(remainingSeconds).padStart(2, "0");
        return `${paddedMinutes}:${paddedSeconds}`;
    }

    function showHighscoreInput() {
        showNameInput = true;
    }

    // Remove the old submitScore function and replace it with this.
    async function handleSubmit() {
        console.log("handleSubmit");
        if (!playerName.trim()) return;

        isSubmitting = true;

        // Prepare the data in the format Netlify expects
        const formData = new URLSearchParams();
        formData.append("form-name", "leaderboard");
        formData.append("playerName", playerName.trim());
        formData.append("time", finalTime);

        try {
            const response = await fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString(),
            });

            if (response.ok) {
                // SUCCESS! Netlify accepted the submission.
                // Now, update the UI and local high scores.
                highscores = [
                    ...highscores,
                    { name: playerName.trim(), time: finalTime },
                ]
                    .sort(
                        (a, b) => timeToSeconds(a.time) - timeToSeconds(b.time),
                    )
                    .slice(0, 10);

                nameSubmitted = true; // This shows your success message ✅
                showNameInput = false; // This hides the form
                console.log("OK!");
            } else {
                // Handle server-side errors
                alert(
                    "Sorry, there was an error submitting your score. Please try again.",
                );
                console.error("Netlify form submission failed:", response);
            }
        } catch (error) {
            // Handle network errors
            alert(
                "A network error occurred. Please check your connection and try again.",
            );
            console.error("Error submitting form to Netlify:", error);
        } finally {
            isSubmitting = false; // Re-enable the submit button
        }
    }

    function timeToSeconds(timeStr) {
        const [minutes, seconds] = timeStr.split(":").map(Number);
        return minutes * 60 + seconds;
    }

    function playAgain() {
        gameStore.reset();
        localStorage.removeItem("gameFinalTime");
        localStorage.setItem("gameStartTime", "false");
        localStorage.setItem("isGameTimerRunning", "false");
        window.dispatchEvent(new CustomEvent("reset-timer"));
    }

    function shareGame() {
        const shareText = `Hey! I solved this Trick of Treat game in ${finalTime}! 💀 Try to beat my time… if you dare.`;
        const shareUrl = window.location.origin;

        if (navigator.share) {
            navigator.share({
                title: "Trick or Treat - Halloween Escape Room",
                text: shareText,
                url: shareUrl,
            });
        } else {
            // Fallback for desktop/unsupported browsers
            navigator.clipboard
                .writeText(`${shareText} ${shareUrl}`)
                .then(() => {
                    alert("Share link copied to clipboard!");
                });
        }
    }

    onMount(() => {
        // Read the final time from localStorage
        const storedFinalTime = localStorage.getItem("gameFinalTime");
        if (storedFinalTime) {
            finalTimeInSeconds = parseInt(storedFinalTime, 10); // Store the raw seconds
            finalTime = formatTimeFromSeconds(finalTimeInSeconds); // Format for display
        }

        const elements = document.querySelectorAll(".animate-in");
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add("opacity-100", "translate-y-0");
            }, index * 200);
        });
    });
</script>

<div
    class="w-full min-h-screen bg-cover bg-center relative"
    style="background-image: url('/sky.png');"
>
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

    <div
        class="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-center overflow-y-auto"
    >
        <div class="max-w-4xl w-full">
            <div
                class="animate-in opacity-0 translate-y-8 transition-all duration-1000 mb-8"
            >
                <p class="text-gray-300 text-3xl md:text-4xl font-semibold">
                    Congratulations! You deserve candy.
                </p>
            </div>

            <div
                class="animate-in opacity-0 translate-y-8 transition-all duration-1000 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-orange-500/30"
            >
                <h2 class="text-3xl font-bold text-orange-400 mb-2">
                    Your Time:
                </h2>
                <div class="text-6xl font-mono text-green-400 mb-2">
                    {finalTime}
                </div>
                <p class="text-gray-400">Not bad for a mortal! 👻</p>
            </div>

            <div
                class="animate-in opacity-0 translate-y-8 transition-all duration-1000 mb-12"
            >
                <button
                    on:click={shareGame}
                    class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-blue-500/30"
                >
                    📱 Share with Friends
                </button>
                <p class="text-gray-400 mt-3 max-w-xs mx-auto">
                    Join the scaring party — challenge your friends to beat your
                    time!
                </p>
            </div>

            <div
                class="animate-in opacity-0 translate-y-8 transition-all duration-1000 mb-12"
            >
                <div
                    class="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 backdrop-blur-sm rounded-lg p-8 border border-blue-500/30 max-w-4xl mx-auto"
                >
                    <div class="grid md:grid-cols-2 gap-8 items-center">
                        <div class="order-2 md:order-1">
                            <img
                                src="https://virtual.mobileescapes.ca/blue-moon/promo_en.jpg"
                                alt="Once in a Blue Moon escape room promo"
                                class="w-full max-w-sm mx-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                            />
                        </div>

                        <div class="order-1 md:order-2">
                            <h3 class="text-3xl font-bold text-blue-300 mb-4">
                                🌙 Once in a Blue Moon
                            </h3>
                            <p class="text-gray-300 text-lg mb-4">
                                Experience the ultimate Halloween escape room!
                                Race to escape a spooky manor during a rare blue
                                moon on October 31st. Perfect for team building
                                and special events.
                            </p>
                            <div
                                class="flex flex-wrap gap-2 justify-center md:justify-start mb-6"
                            >
                                <span
                                    class="bg-blue-600/30 px-3 py-1 rounded-full text-blue-200 text-sm"
                                    >Team Building</span
                                >
                                <span
                                    class="bg-blue-600/30 px-3 py-1 rounded-full text-blue-200 text-sm"
                                    >Classrooms</span
                                >
                                <span
                                    class="bg-blue-600/30 px-3 py-1 rounded-full text-blue-200 text-sm"
                                    >Corporate Events</span
                                >
                            </div>

                            <div
                                class="bg-orange-500/20 border border-orange-400 rounded-lg p-4 mb-6"
                            >
                                <p class="text-orange-200 font-bold text-lg">
                                    🎃 Halloween Special!
                                </p>
                                <p class="text-orange-100">
                                    Use code <span
                                        class="font-mono bg-orange-600 px-2 py-1 rounded text-white"
                                        >HALLLOWEEN</span
                                    >
                                </p>
                                <p class="text-orange-200 text-sm">
                                    50% off for up to 20 players
                                </p>
                            </div>

                            <a
                                href="https://www.mobileescapes.ca/contact-us"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-orange-500/50"
                            >
                                Book Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="animate-in opacity-0 translate-y-8 transition-all duration-1000 mb-12"
            >
                {#if nameSubmitted}
                    <div
                        class="bg-green-800/50 backdrop-blur-sm rounded-lg p-4 mb-6 border border-green-500/30"
                    >
                        <p class="text-green-400 font-bold">
                            ✅ Score submitted successfully!
                        </p>
                    </div>
                {:else if showNameInput}
                    <div
                        class="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-purple-500/30"
                    >
                        <h3 class="text-xl font-bold text-purple-400 mb-4">
                            Enter Your Name for the Leaderboard
                        </h3>
                        <form
                            name="leaderboard"
                            method="POST"
                            netlify
                            on:submit|preventDefault={handleSubmit}
                            class="flex flex-col sm:flex-row gap-4 items-center justify-center"
                        >
                            <input
                                type="hidden"
                                name="form-name"
                                value="leaderboard"
                            />
                            <input
                                type="hidden"
                                name="time"
                                value={finalTime}
                            />
                            <input
                                type="text"
                                name="playerName"
                                bind:value={playerName}
                                placeholder="Enter your spooky name..."
                                class="px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                                required
                                maxlength="20"
                            />
                            <button
                                type="submit"
                                disabled={!playerName.trim() || isSubmitting}
                                class="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded font-bold transition-all duration-300"
                            >
                                {isSubmitting
                                    ? "Submitting..."
                                    : "Submit Score"}
                            </button>
                        </form>
                    </div>
                {:else}
                    <button
                        on:click={showHighscoreInput}
                        class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-purple-500/30 mb-6"
                    >
                        🏆 Add to Leaderboard
                    </button>
                {/if}
                <div
                    class="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-600/30"
                >
                    <h3 class="text-2xl font-bold text-yellow-400 mb-4">
                        🏆 Leaderboard - Top Escapees
                    </h3>
                    <div class="space-y-2">
                        {#each highscores.slice(0, 5) as score, index}
                            <div
                                class="flex justify-between items-center p-2 rounded {index <
                                3
                                    ? 'bg-yellow-500/20'
                                    : 'bg-gray-700/30'}"
                            >
                                <div class="flex items-center gap-3">
                                    <span
                                        class="text-lg font-bold {index === 0
                                            ? 'text-yellow-400'
                                            : index === 1
                                              ? 'text-gray-300'
                                              : index === 2
                                                ? 'text-orange-400'
                                                : 'text-gray-400'}"
                                    >
                                        {index + 1}.
                                    </span>
                                    <span class="text-white font-medium"
                                        >{score.name}</span
                                    >
                                    {#if score.name === playerName.trim() && nameSubmitted}
                                        <span class="text-green-400 text-sm"
                                            >← You!</span
                                        >
                                    {/if}
                                </div>
                                <span class="font-mono text-green-400 font-bold"
                                    >{score.time}</span
                                >
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <div
                class="animate-in opacity-0 translate-y-8 transition-all duration-1000"
            >
                <button
                    on:click={playAgain}
                    class="mb-4 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-orange-500/30"
                >
                    🎃 Play Again
                </button>
            </div>

            <div class="mt-12 pt-8 border-t border-gray-700/30 mb-3">
                <p class="text-gray-400 text-sm">
                    Made with ❤️ in Ottawa by
                    <a
                        href="https://www.mobileescapes.ca/about-us"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                    >
                        Mobile Escapes
                    </a>
                </p>
            </div>
        </div>
    </div>
</div>

<style>
    .animate-in {
        transition:
            opacity 1s ease-out,
            transform 1s ease-out;
    }
</style>
