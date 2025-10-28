import { Howl } from "howler";
import { FILE } from "./i18n";

// NOTE: Make sure you place your audio files in the `static` folder.

// Background music, configured to loop at a lower volume.
export const moodMusic = new Howl({
  src: [FILE.music],
  loop: true,
  volume: 0.3,
  html5: true, // Important for broader mobile compatibility
  preload: true,
});

// A simple click sound for UI interactions.
export const clickSound = new Howl({
  src: [FILE.click],
  volume: 0.7,
  preload: true,
});

// Sound for successfully solving a puzzle.
export const successSound = new Howl({
  src: [FILE.unlock],
  volume: 0.8,
  preload: true,
});

// Sound for an incorrect answer.
export const errorSound = new Howl({
  src: [FILE.incorrect],
  volume: 0.6,
  preload: true,
});

export const suspiciousSound = new Howl({
  src: [FILE.first],
  preload: true,
});

export const courageSound = new Howl({
  src: [FILE.deep],
  preload: true,
});

export const knockSound = new Howl({
  src: [FILE.knock],
  preload: true,
});

export const dustySound = new Howl({
  src: [FILE.dusty],
  preload: true,
});

export const warningSound = new Howl({
  src: [FILE.warning],
  preload: true,
});

export const beetleSound = new Howl({
  src: [FILE.beetle],
  preload: true,
});

export const buzzSound = new Howl({
  src: [FILE.buzz],
  volume: 0.4,
  preload: true,
});

export const creepyDoorSound = new Howl({
  src: [FILE.creepydoor],
  volume: 0.7,
  preload: true,
});

export const congratsSound = new Howl({
  src: [FILE.congrats],
  preload: true,
});

export const dingDongSound = new Howl({
  src: [FILE.dingdong],
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
