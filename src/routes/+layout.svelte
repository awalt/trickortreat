<script>
	import favicon from '$lib/assets/favicon.svg';
  import "../app.css";
  import DebugMenu from '$lib/DebugMenu.svelte'; // Import the new component

	let { children } = $props();

    
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<DebugMenu />