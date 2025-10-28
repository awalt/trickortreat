<!--
  Spider.svelte
  This component displays a spider that walks a pre-determined path
  on top of the entire page.
-->
<svelte:head>
    <!--
      We place the keyframes in <svelte:head> to make them global.
      This ensures the animation works correctly, as scoped
      keyframes can sometimes have issues with complex animations
      being applied to elements.
    -->
    <style>
        @keyframes walk-path {
            /*
              Total travel distance:
              Move 1 (Up): 105vh -> 75vh = 30vh
              Move 2 (Right): 50% -> 50% + 25vh = 25vh
              Move 3 (Down): 75vh -> 25vh = 50vh
              Move 4 (Left): 50% + 25vh -> 50% = 25vh
              Move 5 (Up): 25vh -> -10vh = 35vh
              TOTAL = 165vh

              We will allocate 89% of the animation to travel (165vh / 89% = ~1.85vh per 1%)
              We will allocate 4% for turns (1% each)
              We will allocate 7% for the pause at the end.

              New Durations:
              Move 1 (30vh): 30 / 1.85 = 16.2%
              Move 2 (25vh): 25 / 1.85 = 13.5%
              Move 3 (50vh): 50 / 1.85 = 27.0%
              Move 4 (25vh): 25 / 1.85 = 13.5%
              Move 5 (35vh): 35 / 1.85 = 18.9%
              Total Travel Time: 16.2 + 13.5 + 27.0 + 13.5 + 18.9 = 89.1%
            */

            /* 0%: Start (Pos 0) */
            0% {
                /* Start off-screen at the bottom, facing up */
                top: calc(100vh + 50px); /* <-- FIX */
                left: 50%;
                transform: translate(-50%, -50%) rotate(0deg);
            }

            /* 16.2%: Arrive 1 (End Move 1) */
            16.2% {
                /* Move 1: Walk UP */
                top: 75vh;
                left: 50%;
                transform: translate(-50%, -50%) rotate(0deg);
            }
            /* 17.2%: Turn 1 (1% turn) */
            17.2% {
                /* Turn 1: Turn RIGHT */
                top: 75vh;
                left: 50%;
                transform: translate(-50%, -50%) rotate(90deg);
            }

            /* 17.2% + 13.5% = 30.7%: Arrive 2 (End Move 2) */
            30.7% {
                /* Move 2: Walk RIGHT */
                top: 75vh;
                left: calc(50% + 25vh);
                transform: translate(-50%, -50%) rotate(90deg);
            }
            /* 31.7%: Turn 2 (1% turn) */
            31.7% {
                /* Turn 2: Turn UP */
                top: 75vh;
                left: calc(50% + 25vh);
                transform: translate(-50%, -50%) rotate(0deg);
            }

            /* 31.7% + 27.0% = 58.7%: Arrive 3 (End Move 3) */
            58.7% {
                /* Move 3: Walk UP */
                top: 25vh;
                left: calc(50% + 25vh);
                transform: translate(-50%, -50%) rotate(0deg);
            }
            /* FIX: Split "Turn 3" into two 0.5% steps.
              This forces the animation to go clockwise 180 -> 225 -> 270
              instead of spinning counter-clockwise the long way around.
            */
            /* 59.2%: Turn 3 - Midpoint (0.5% turn) */
            59.2% {
                /* Turn 3: Turn LEFT (part 1) */
                top: 25vh;
                left: calc(50% + 25vh);
                transform: translate(-50%, -50%) rotate(-90deg);
            }
            /* 59.7%: Turn 3 - End (0.5% turn) */
            59.7% {
                /* Turn 3: Turn LEFT (part 2) */
                top: 25vh;
                left: calc(50% + 25vh);
                transform: translate(-50%, -50%) rotate(-90deg);
            }

            /* 59.7% + 13.5% = 73.2%: Arrive 4 (End Move 4) */
            73.2% {
                /* Move 4: Walk LEFT */
                top: 25vh;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-90deg);
            }
            /* 74.2%: Turn 4 (1% turn)
               FIX: Use 360deg instead of 0deg to force a 90-degree clockwise turn
            */
            74.2% {
                /* Turn 4: Turn UP */
                top: 25vh;
                left: 50%;
                transform: translate(-50%, -50%) rotate(0deg);
            }

            /* 74.2% + 18.9% = 93.1%: Arrive 5 (Exit Top, End Move 5)
               Must also be 360deg to maintain the 'up' direction
            */
            93.1% {
                /* Move 5: Walk UP and exit stage top */
                top: -10vh; /* Move off-screen */
                left: 50%;
                transform: translate(-50%, -50%) rotate(0deg);
            }

            /* 93.11% - 100%: Pause.
               Instantly snap back to the start position (off-screen bottom)
               We can reset the rotation to 0deg here, as it's an instant jump
               and prepares it for the next loop which starts at 0deg.
            */
            93.11% {
                /* Instantly snap to start position */
                top: calc(100vh + 50px); /* <-- FIX */
                left: 50%;
                transform: translate(-50%, -50%) rotate(0deg);
            }

            /* Hold at the start position until 100% */
            100% {
                /* PAUSE at start position (off-screen) */
                top: calc(100vh + 50px); /* <-- FIX */
                left: 50%;
                transform: translate(-50%, -50%) rotate(0deg);
            }
        }

        /*
          This animation cycles the background-position of the sprite.
          It moves the background from 0 to the total width of the sheet.
        */
        @keyframes cycle-sprite {
            from {
                background-position: 0 0;
            }
            to {
                /* Calculate the final position: (tile_width * num_tiles) * -1
                  e.g., (100px * 7) * -1 = -700px
                */
                background-position: calc(
                        var(--tile-width) * var(--num-tiles) * -1
                    )
                    0;
            }
        }

        /* This animation handles the side-to-side wiggle */
        @keyframes wiggle {
            0% {
                transform: rotate(-6deg);
            }
            50% {
                transform: rotate(6deg);
            }
            100% {
                transform: rotate(-6deg);
            }
        }
    </style>
</svelte:head>

<!-- This container moves along the path -->
<div id="spider-container">
    <!-- This div shows the cycling sprite animation -->
    <div id="spider-sprite"></div>
</div>

<style>
    /* These variables define the spider's appearance and animation speed.
      They are scoped to this component.
    */
    :root {
        --sprite-image-url: url("https://imgix.mobileescapes.ca/trickortreat/spider-sprite.png");
        --tile-width: 69px;
        --tile-height: 90px;
        --num-tiles: 7;
        --animation-speed: 0.7s; /* How fast the sprite cycles */
    }

    /* This is the container that handles the movement path.
      It's positioned absolutely to float over the page content.
    */
    #spider-container {
        /* CHANGE THIS from 'absolute' to 'fixed' */
        position: fixed;

        z-index: 9999;

        /* These lines correctly set the initial state */
        top: calc(100vh + 50px);
        left: 50%;
        transform: translate(-50%, -50%) rotate(0deg);

        /* Animation rules are correct */
        animation: walk-path 12s linear 4s infinite backwards;
        pointer-events: none;
    }

    /* This is the element that shows the sprite itself.
      It handles the sprite sheet (cycling) animation.
    */
    #spider-sprite {
        width: var(--tile-width);
        height: var(--tile-height);

        background-image: var(--sprite-image-url);
        background-repeat: no-repeat;
        background-position: 0 0;

        /* Add a 4s delay to both animations */
        animation:
            cycle-sprite var(--animation-speed) steps(var(--num-tiles)) 4s
                infinite,
            wiggle 0.4s ease-in-out 4s infinite;

        image-rendering: pixelated;
    }
</style>
