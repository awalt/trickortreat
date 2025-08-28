<script>
    import Intro from '$lib/components/Intro.svelte';
    import Door from '$lib/components/Door.svelte';
    import Puzzle2 from '$lib/components/Puzzle2.svelte';
    import Knock from '$lib/components/Knock.svelte';
    import Bug from '$lib/components/Bug.svelte';
    import Conclusion from '$lib/components/Conclusion.svelte';
    import VideoTransition from '$lib/components/VideoTransition.svelte';
    import Splash from '$lib/components/Splash.svelte'; // Import Splash component
    import DoorScene from '$lib/components/DoorScene.svelte';
    import { gameStore } from '$lib/gameStore.js';
</script>

<main class="h-screen w-screen bg-gray-900 text-white">
    {#if $gameStore.currentView === 'splash'}
        <Splash />
    {:else if $gameStore.currentView === 'intro'}
        <Intro />
    {:else if $gameStore.currentView === 'walking'}
        <VideoTransition />
    {:else if $gameStore.currentView === 'doorScene'}
        <DoorScene />
    {:else if $gameStore.currentView === 'door'}
        <Door />
    {:else if $gameStore.currentView === 'puzzle2'}
        <Puzzle2 />
    {:else if $gameStore.currentView === 'knock'}
        <Knock />
    {:else if $gameStore.currentView === 'bug'}
        <Bug />
    {:else if $gameStore.currentView === 'conclusion'}
        <Conclusion />
    {/if}
</main>