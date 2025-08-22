<script>
  import { onMount, onDestroy } from 'svelte';

  // The video file to be played.
  export let src;
  
  // The specific RGB color to make transparent.
  export let keyColor = { r: 0, g: 255, b: 0 };

  // Tolerance for color matching.
  export let tolerance = 70;

  // The delay in milliseconds before the video loops again.
  export let loopDelay = 2000;

  let canvasEl;
  let videoEl;

  let isPortrait = false;

  function checkOrientation() {
    isPortrait = window.innerHeight > window.innerWidth;
  }

  // This function handles restarting the video after the specified delay.
  function handleVideoEnd() {
    // console.log('Video ended. Starting timeout for', loopDelay, 'ms');
    setTimeout(() => {
      if (videoEl) {
        // console.log('Timeout finished. Restarting video.');
        videoEl.currentTime = 0;
        videoEl.play();
      }
    }, loopDelay);
  }

  onMount(() => {
    const ctx = canvasEl.getContext('2d', { willReadFrequently: true });

    function draw() {
      if (!canvasEl || videoEl.paused || videoEl.ended || videoEl.videoWidth === 0) {
        requestAnimationFrame(draw);
        return;
      }

      const canvasWidth = canvasEl.clientWidth;
      const canvasHeight = canvasEl.clientHeight;
      if (canvasEl.width !== canvasWidth || canvasEl.height !== canvasHeight) {
        canvasEl.width = canvasWidth;
        canvasEl.height = canvasHeight;
      }

      const videoWidth = videoEl.videoWidth;
      const videoHeight = videoEl.videoHeight;
      const videoRatio = videoWidth / videoHeight;
      const canvasRatio = canvasWidth / canvasHeight;
      let drawWidth, drawHeight, offsetX, offsetY;
      if (videoRatio > canvasRatio) {
        drawHeight = canvasHeight;
        drawWidth = drawHeight * videoRatio;
        offsetY = 0;
        offsetX = (canvasWidth - drawWidth) / 2;
      } else {
        drawWidth = canvasWidth;
        drawHeight = drawWidth / videoRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      }
      ctx.drawImage(videoEl, offsetX, offsetY, drawWidth, drawHeight);

      const frame = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      const data = frame.data;
      const len = data.length;
      for (let i = 0; i < len; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        const distance = Math.sqrt(
          Math.pow(red - keyColor.r, 2) +
          Math.pow(green - keyColor.g, 2) +
          Math.pow(blue - keyColor.b, 2)
        );
        if (distance < tolerance) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(frame, 0, 0);
      requestAnimationFrame(draw);
    }

    // --- MODIFICATION START ---
    videoEl.addEventListener('canplay', () => {
      // Start the video manually to ensure our script is in control.
      videoEl.play(); 
      requestAnimationFrame(draw);
    });
    // --- MODIFICATION END ---
    
    videoEl.addEventListener('ended', handleVideoEnd);

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
  });

  onDestroy(() => {
    window.removeEventListener('resize', checkOrientation);
    if (videoEl) {
      videoEl.removeEventListener('ended', handleVideoEnd);
    }
  });
</script>

<div class="w-full h-full flex items-center justify-center" class:is-portrait={isPortrait}>
  <video bind:this={videoEl} {src} playsinline muted></video>
  <canvas bind:this={canvasEl} class="w-full h-full"></canvas>
</div>

<style>
  video {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }
  .is-portrait > canvas {
    transform: rotate(90deg);
    width: 100vh;
    height: 100vw;
  }
</style>