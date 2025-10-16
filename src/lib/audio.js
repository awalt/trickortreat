import { Howl } from "howler";

// NOTE: Make sure you place your audio files in the `static` folder.

// Background music, configured to loop at a lower volume.
export const moodMusic = new Howl({
  src: ["/music.mp3"],
  loop: true,
  volume: 0.3,
  html5: true, // Important for broader mobile compatibility
  preload: true,
});

// A simple click sound for UI interactions.
export const clickSound = new Howl({
  src: ["/click.mp3"],
  volume: 0.7,
  preload: true,
});

// Sound for successfully solving a puzzle.
export const successSound = new Howl({
  src: ["/unlock.mp3"],
  volume: 0.8,
  preload: true,
});

// Sound for an incorrect answer.
export const errorSound = new Howl({
  src: ["/incorrect.mp3"],
  volume: 0.6,
  preload: true,
});

export const suspiciousSound = new Howl({
  src: ["/first.mp3"],
  preload: true,
});

export const courageSound = new Howl({
  src: ["/deep.mp3"],
  preload: true,
});

export const knockSound = new Howl({
  src: ["/knock.mp3"],
  preload: true,
});

export const dustySound = new Howl({
  src: ["/dusty.mp3"],
  preload: true,
});

export const warningSound = new Howl({
  src: ["/warning.mp3"],
  preload: true,
});

export const beetleSound = new Howl({
  src: ["/beetle.mp3"],
  preload: true,
});

export const buzzSound = new Howl({
  src: ["/buzz.mp3"],
  volume: 0.4,
  preload: true,
});

export const creepyDoorSound = new Howl({
  src: ["/creepydoor.mp3"],
  volume: 0.7,
  preload: true,
});

export const congratsSound = new Howl({
  src: ["/congrats.wav"],
  preload: true,
});

export const dingDongSound = new Howl({
  src: ["/dingdong.mp3"],
  volume: 0.4,
  preload: true,
});

// Collect all sounds for batch operations
export const allSounds = [
  moodMusic,
  clickSound,
  successSound,
  errorSound,
  suspiciousSound,
  courageSound,
  knockSound,
  dustySound,
  warningSound,
  beetleSound,
  buzzSound,
  creepyDoorSound,
  congratsSound,
  dingDongSound,
];

// Preload all sounds after user interaction
export function preloadAllSounds() {
  return Promise.all(
    allSounds.map((sound) => {
      return new Promise((resolve, reject) => {
        if (sound.state() === "loaded") {
          resolve(sound);
          return;
        }

        sound.once("load", () => resolve(sound));
        sound.once("loaderror", reject);

        // Force load if not already loading
        if (sound.state() === "unloaded") {
          sound.load();
        }
      });
    }),
  )
    .then(() => {
      console.log("All sounds preloaded");
    })
    .catch((error) => {
      console.warn("Some sounds failed to preload:", error);
    });
}

// Check if all sounds are loaded
export function areAllSoundsLoaded() {
  return allSounds.every((sound) => sound.state() === "loaded");
}

// Stop all currently playing sounds
export function stopAllSounds() {
  allSounds.forEach((sound) => {
    if (sound.playing()) {
      sound.stop();
    }
  });
}
