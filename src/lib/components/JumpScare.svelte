<script>
    import { onMount } from "svelte";

    export let delay = 0;

    let videoElement;
    let showVideo = false;
    let closeTimer = null;
    let videoReady = false;

    onMount(() => {
        const startTimeout = setTimeout(() => {
            showVideo = true;
        }, delay);

        // Cleanup timers when the component is destroyed
        return () => {
            clearTimeout(startTimeout);
            if (closeTimer) clearTimeout(closeTimer);
        };
    });

    const hideVideo = () => {
        // No longer need to exit fullscreen
        showVideo = false;
    };

    const onCanPlay = () => {
        videoReady = true;
        videoElement.play();

        // Set a timer to hide the video
        closeTimer = setTimeout(hideVideo, 550);

        // REMOVED: The requestFullscreen() call was causing the orientation flip.
        // Your CSS already handles the fullscreen effect.
    };
</script>

{#if showVideo}
    <div class="fullscreen-video" style="opacity: {videoReady ? 1 : 0};">
        <video
            bind:this={videoElement}
            src="/scareshort.mp4"
            preload="auto"
            playsinline
            poster="/scareshort.png"
            controls={false}
            on:canplaythrough={onCanPlay}
        />
    </div>
{/if}

<style>
    .fullscreen-video {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: black;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: opacity 0.1s linear;
    }

    video {
        width: 100%;
        height: 100%;
        /* This is the key property that crops the video to fill the screen */
        object-fit: cover;
    }
</style>
