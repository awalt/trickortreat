<script>
  import { onMount, onDestroy } from 'svelte';
  // Import the controller from our new JS file
  import BugController from '$lib/bugController.js';

  // --- Props (These are now passed to the controller) ---
  export let imageSprite = '/spider-sprite.png';
  export let bugWidth = 80;
  export let bugHeight = 80;
  export let numFrames = 5;
  export let minBugs = 1;
  export let maxBugs = 1;
  export let canFly = false;
  export let canDie = false;
  export let mouseOver = 'random';

  let bugControllerInstance;

  onMount(() => {
    // Create a new instance of the controller and pass in the props
    bugControllerInstance = new BugController();
    console.log("on mount init")
    bugControllerInstance.initialize({
      imageSprite,
      bugWidth,
      bugHeight,
      num_frames: numFrames,
      minBugs,
      maxBugs,
      canFly,
      canDie,
      mouseOver
    });
  });

  // Clean up when the component is removed from the page
  onDestroy(() => {
    if (bugControllerInstance) {
        console.log("destroy bug")
      bugControllerInstance.end();
    }
  });
</script>