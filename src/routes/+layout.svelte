<script>
	import favicon from '$lib/assets/favicon.svg';
  import "../app.css";
  import DebugMenu from '$lib/DebugMenu.svelte'; // Import the new component

	let { children } = $props();

    
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
</svelte:head>

{@render children?.()}

<DebugMenu />