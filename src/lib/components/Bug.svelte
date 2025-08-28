<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import SubmitButton from './SubmitButton.svelte';

  // Import the BugController class from your new JS file.
  import BugController, { bugControllerManager } from '$lib/bugController.js';

  let spiderController;

  onMount(() => {
    // Note: The original library was designed to create swarms.
    // To control a single bug, we can create a controller with minBugs = 1 and maxBugs = 1.
    spiderController = new BugController();
    spiderController.initialize({
      imageSprite: 'spider-sprite.png',
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
      maxBugs: 1
    });

    const spider = spiderController.bugs[0]; // Get the single spider instance

    // This async function directs the bug to a target coordinate.
    async function walkTo(bugInstance, target) {
      return new Promise(resolve => {
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

          if (distance < 15) { // If close enough, stop and resolve
            clearInterval(interval);
            resolve();
          } else {
            // Point the bug towards the target
            bugInstance.angle_deg = -Math.atan2(dy, dx) * (180 / Math.PI);
            bugInstance.angle_rad = bugInstance.deg2rad(bugInstance.angle_deg);
          }
        }, 50); // Check position and adjust angle every 50ms
      });
    }

    // This robust function sets the spider's position.
    async function setSpiderPosition(x, y) {
      return new Promise(resolve => {
        const interval = setInterval(() => {
          // Wait until the spider's HTML element (spider.bug) is created by the library
          if (spider && spider.bug) {
            clearInterval(interval);
            
            // **THE FIX**: Use the library's own method to set the position.
            // The method takes (top, left) arguments, so we pass y then x.
            spider.setPos(y, x);
            
            resolve();
          }
        }, 50); // Check every 50ms
      });
    }

    async function spiderPatrol() {
      // Define path waypoints based on screen dimensions
      const leftX = window.innerWidth * 0.2;
      const rightX = window.innerWidth * 0.8;
      const topY = window.innerHeight * 0.2;
      const bottomY = window.innerHeight * 0.8;
      // Correct starting position: place the spider's bottom edge at the screen's bottom
      const startY = window.innerHeight - spiderController.options.bugHeight;
      const offscreenY = -spiderController.options.bugHeight;

      // Loop the spider's path indefinitely
      while (true) {
        // Use the new robust function to place the spider at its start point
        await setSpiderPosition(leftX, startY);
        spider.go();

        // 1. March up
        await walkTo(spider, { x: leftX, y: topY });

        // 2. March right
        await walkTo(spider, { x: rightX, y: topY });

        // 3. March down
        await walkTo(spider, { x: rightX, y: bottomY });

        // 4. March left
        await walkTo(spider, { x: leftX, y: bottomY });

        // 5. March up and offscreen
        await walkTo(spider, { x: leftX, y: offscreenY });
      }
    }

    // Start the spider's walk after a delay
    setTimeout(spiderPatrol, 2000);
  });

  onDestroy(() => {
    // Check if the controller was initialized before trying to destroy it
    if (typeof spiderController != "undefined") {
      bugControllerManager.killAll();
    }
  });


  // Define the correct answer with 5 directions.
  const correctAnswer = ['up', 'right', 'down', 'left', 'up'];

  // This variable will be updated based on the user's submission.
  let isCorrect = null;

  /**
   * This function is called when the SubmitButton dispatches a 'submit' event.
   */
  function checkAnswer(event) {
    const submittedCombination = event.detail;
    if (!submittedCombination) return;
    isCorrect = JSON.stringify(submittedCombination) === JSON.stringify(correctAnswer);
  }

  /**
   * This function is called when the user clicks 'Continue' after a correct answer.
   */
  function handleContinue() {
    console.log('Proceeding to the next level!');
    alert('You solved it! We would move on... but this is not coded yet.');
  }
</script>

<div 
  class="relative w-full h-full flex flex-col items-center justify-center p-8 text-center bg-green-900 text-gray-300 overflow-hidden" 
  in:fade={{ duration: 1000 }}
>
  <div class="z-10">
    <h1 class="text-5xl md:text-6xl mb-4 font-serif text-yellow-400">
      Peephole
    </h1>
    <img src="/path.png" alt="A winding path" class="w-full h-auto max-w-lg">
    <p class="text-lg md:text-xl max-w-2xl mx-auto">
      There would be like a vignette peephole around the image or something.
    </p>


    <SubmitButton
      {isCorrect}
      inputType="directional"
      combinationLength={5}
      on:submit={checkAnswer}
      on:continue={handleContinue}
    />
  </div>
</div>