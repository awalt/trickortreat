<script>
    //This file is: +page.svelte
    import Intro from "$lib/components/Intro.svelte";
    import Door from "$lib/components/Door.svelte";
    import Puzzle2 from "$lib/components/Puzzle2.svelte";
    import Knock from "$lib/components/Knock.svelte";
    import Bug from "$lib/components/Bug.svelte";
    import Conclusion from "$lib/components/Conclusion.svelte";
    import VideoTransition from "$lib/components/VideoTransition.svelte";
    import Splash from "$lib/components/Splash.svelte";
    import DoorScene from "$lib/components/DoorScene.svelte";
    import Candy from "$lib/components/Candy.svelte";
    import { gameStore } from "$lib/gameStore.js";
    import Timer from "$lib/components/Timer.svelte";

    // Define which pages should display the persistent timer
    const pagesWithTimer = ["Door", "Knock", "Bug", "Candy"];

    console.log(
        "+page.svelte: currentView changed to:",
        $gameStore.currentView,
    );

    // Scroll to top whenever the current view changes
    $effect(() => {
        $gameStore.currentView; // Track this value
        window.scrollTo({ top: 0, behavior: "instant" });
    });
</script>

<main class="h-screen w-full bg-gray-900 text-white">
    <!-- Persistent Timer: Renders a single timer instance for specific pages -->
    {#if pagesWithTimer.includes($gameStore.currentView)}
        <div class="w-full pt-4 text-center">
            <Timer />
        </div>
    {/if}

    {#if $gameStore.currentView === "Splash"}
        <Splash />
    {:else if $gameStore.currentView === "Intro"}
        <Intro />
    {:else if $gameStore.currentView === "VideoTransition"}
        <VideoTransition />
    {:else if $gameStore.currentView === "DoorScene"}
        <DoorScene />
    {:else if $gameStore.currentView === "Door"}
        <Door />
    {:else if $gameStore.currentView === "Puzzle2"}
        <Puzzle2 />
    {:else if $gameStore.currentView === "Knock"}
        <Knock />
    {:else if $gameStore.currentView === "Bug"}
        <Bug />
    {:else if $gameStore.currentView === "Candy"}
        <Candy />
    {:else if $gameStore.currentView === "Conclusion"}
        <Conclusion />
    {/if}
</main>
