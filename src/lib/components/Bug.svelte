<script>
  import { onMount,onDestroy  } from 'svelte';
  import { fade } from 'svelte/transition';
    import SubmitButton from './SubmitButton.svelte';

  // WRONG: import Bug from '$lib/components/Bug.svelte'; 
  // RIGHT: Import the BugController class from your new JS file.
  import BugController from '$lib/bugController.js'; 

  onMount(() => {
    // Note: The original library was designed to create swarms.
    // To control a single bug, we can create a controller with minBugs = 1 and maxBugs = 1.
    const spiderController = new BugController();
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

    console.log(spider)

    // --- We need to create a walkTo function, as the library doesn't have one ---
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

          if (distance < 10) { // If close enough, stop
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

    async function performZWalk() {
      // Start the bug walking
      spider.go(); 
      
      // 1. Walk to top-right
      await walkTo(spider, { x: window.innerWidth - 100, y: 100 });
      // 2. Walk to bottom-left
      await walkTo(spider, { x: 100, y: window.innerHeight - 100 });
      // 3. Walk to bottom-right
      await walkTo(spider, { x: window.innerWidth - 100, y: window.innerHeight - 100 });

      // Loop
      performZWalk();
    }

    // Start the spider's walk after a delay
    setTimeout(performZWalk, 2000);
  });



   onDestroy(() => {
    // Check if the controller was initialized before trying to destroy it
    if (spiderController) {
      // NOTE: The method name might be different. 
      // Common names are destroyAllBugs(), stop(), removeAll(), or cleanup().
      // Please check the bug library's documentation for the correct method.
      spiderController.destroyAllBugs(); 
    }
  });


  // 1. Define the correct answer with 5 directions.
  const correctAnswer = ['right', 'down', 'left', 'up', 'right'];

  // 2. This variable will be updated based on the user's submission.
  let isCorrect = null;

  /**
   * This function is called when the SubmitButton dispatches a 'submit' event.
   * The event.detail contains the user's combination array.
   */
  function checkAnswer(event) {
    const submittedCombination = event.detail;
    if (!submittedCombination) return;

    // We compare the submitted array to the correct answer.
    // Converting to JSON strings is an easy way to check for array equality.
    isCorrect = JSON.stringify(submittedCombination) === JSON.stringify(correctAnswer);
  }

  /**
   * This function is called when the user clicks 'Continue' after a correct answer.
   */
  function handleContinue() {
    // You would typically navigate to the next puzzle or update the game state here.
    console.log('Proceeding to the next level!');
    alert('You solved it! Moving on...');
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