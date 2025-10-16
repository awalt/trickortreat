// Video preloader utility
export const videoSources = {
  doorScene: "/houseopen.mp4",
  videoTransition: "/walk2.mp4",
  jumpScare: "/scareshort.mp4",
  runningHouse: "/runninghouse.mp4", // Already being preloaded in Intro
  // Add any other videos you might have
};

class VideoPreloader {
  constructor() {
    this.videos = {};
    this.loadingPromises = {};
    this.loaded = new Set();
  }

  preloadVideo(key, src) {
    // Return existing promise if already loading
    if (this.loadingPromises[key]) {
      return this.loadingPromises[key];
    }

    // Return resolved promise if already loaded
    if (this.loaded.has(key)) {
      return Promise.resolve(this.videos[key]);
    }

    console.log(`Preloading video: ${key} (${src})`);

    this.loadingPromises[key] = new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "auto";
      video.src = src;
      video.muted = true; // Important for autoplay policies

      const onCanPlayThrough = () => {
        console.log(`Video loaded: ${key}`);
        this.videos[key] = video;
        this.loaded.add(key);
        cleanup();
        resolve(video);
      };

      const onError = (error) => {
        console.error(`Failed to load video: ${key}`, error);
        cleanup();
        reject(error);
      };

      const cleanup = () => {
        video.removeEventListener("canplaythrough", onCanPlayThrough);
        video.removeEventListener("error", onError);
      };

      video.addEventListener("canplaythrough", onCanPlayThrough);
      video.addEventListener("error", onError);

      // Start loading
      video.load();
    });

    return this.loadingPromises[key];
  }

  preloadMultiple(videoKeys) {
    const promises = videoKeys.map((key) => {
      if (videoSources[key]) {
        return this.preloadVideo(key, videoSources[key]);
      } else {
        console.warn(`Video key "${key}" not found in videoSources`);
        return Promise.resolve(null);
      }
    });

    return Promise.allSettled(promises);
  }

  preloadAll() {
    return this.preloadMultiple(Object.keys(videoSources));
  }

  isLoaded(key) {
    return this.loaded.has(key);
  }

  getVideo(key) {
    return this.videos[key] || null;
  }

  // Get loading progress (0-1)
  getProgress() {
    const total = Object.keys(videoSources).length;
    const loaded = this.loaded.size;
    return total > 0 ? loaded / total : 0;
  }
}

// Create singleton instance
export const videoPreloader = new VideoPreloader();

// Convenience functions
export const preloadAllVideos = () => videoPreloader.preloadAll();
export const preloadVideos = (keys) => videoPreloader.preloadMultiple(keys);
export const isVideoLoaded = (key) => videoPreloader.isLoaded(key);
export const getPreloadedVideo = (key) => videoPreloader.getVideo(key);
export const getVideoLoadingProgress = () => videoPreloader.getProgress();
