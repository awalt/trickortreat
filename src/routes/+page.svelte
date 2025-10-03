<script>
    import Intro from '$lib/components/Intro.svelte';
    import Door from '$lib/components/Door.svelte';
    import Puzzle2 from '$lib/components/Puzzle2.svelte';
    import Knock from '$lib/components/Knock.svelte';
    import Bug from '$lib/components/Bug.svelte';
    import Conclusion from '$lib/components/Conclusion.svelte';
    import VideoTransition from '$lib/components/VideoTransition.svelte';
    import Splash from '$lib/components/Splash.svelte'; 
    import DoorScene from '$lib/components/DoorScene.svelte';
    import Candy from '$lib/components/Candy.svelte';
    import { gameStore } from '$lib/gameStore.js';
</script>

<main class="h-screen w-full bg-gray-900 text-white">
    {#if $gameStore.currentView === 'Splash'}
        <Splash />
    {:else if $gameStore.currentView === 'Intro'}
        <Intro />
    {:else if $gameStore.currentView === 'VideoTransition'}
        <VideoTransition />
    {:else if $gameStore.currentView === 'DoorScene'}
        <DoorScene />
    {:else if $gameStore.currentView === 'Door'}
        <Door />
    {:else if $gameStore.currentView === 'Puzzle2'}
        <Puzzle2 />
    {:else if $gameStore.currentView === 'Knock'}
        <Knock />
    {:else if $gameStore.currentView === 'Bug'}
        <Bug />
        {:else if $gameStore.currentView === 'Candy'}
        <Candy />
    {:else if $gameStore.currentView === 'Conclusion'}
        <Conclusion />
    {/if}
</main>