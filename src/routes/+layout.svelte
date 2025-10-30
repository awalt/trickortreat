<script>
    import { onMount } from "svelte";
    import "../app.css";
    import DebugMenu from "$lib/DebugMenu.svelte";
    import { browser } from "$app/environment"; // 1. Import browser

    let { children } = $props();

    // 2. Check if in browser AND hostname is 'localhost'
    // This is safe during SSR because 'browser' will be false.
    // 'window.location.hostname' correctly ignores the port number.
    let showDebugMenu = browser && window.location.hostname === "localhost";

    onMount(async () => {
        // Check if the FontFace API is supported
        if ("fonts" in document) {
            try {
                // Load the font and wait for it to be ready
                await document.fonts.load("1em Creepster");
                // Add a class to the body when the font is loaded
                document.body.classList.add("font-loaded");
            } catch (error) {
                console.error("Font could not be loaded:", error);
                // If there's an error, still add the class to show the text with a fallback.
                document.body.classList.add("font-loaded");
            }
        } else {
            // Fallback for older browsers without the FontFace API support
            // Just show the text after a small delay to avoid the initial flicker
            setTimeout(() => {
                document.body.classList.add("font-loaded");
            }, 500);
        }
    });
</script>

<svelte:head>
    <link rel="icon" href="/icon.png" />
</svelte:head>

{@render children?.()}

{#if showDebugMenu}
    <DebugMenu />
{/if}
