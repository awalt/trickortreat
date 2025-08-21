
  import { Howl } from 'howler';

  // NOTE: Make sure you place your audio files in the `static` folder.
  
  // Background music, configured to loop at a lower volume.
  export const moodMusic = new Howl({
    src: ['/music.mp3'],
    loop: true,
    volume: 0.3,
    html5: true // Important for broader mobile compatibility
  });

  // A simple click sound for UI interactions.
  export const clickSound = new Howl({
    src: ['/click.mp3'],
    volume: 0.7
  });

  // Sound for successfully solving a puzzle.
  export const successSound = new Howl({
    src: ['/success.mp3'],
    volume: 0.8
  });

  // Sound for an incorrect answer.
  export const errorSound = new Howl({
    src: ['/error.mp3'],
    volume: 0.6
  });
