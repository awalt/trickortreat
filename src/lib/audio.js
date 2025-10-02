
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
    src: ['/unlock.mp3'],
    volume: 0.8
  });

  // Sound for an incorrect answer.
  export const errorSound = new Howl({
    src: ['/incorrect.mp3'],
    volume: 0.6
  });

  export const suspiciousSound = new Howl({
    src: ['/first.mp3']
});

  export const courageSound = new Howl({
    src: ['/deep.mp3']
});

  export const knockSound = new Howl({
    src: ['/knock.mp3']
});
  export const dustySound = new Howl({
    src: ['/dusty.mp3']
});
  export const warningSound = new Howl({
    src: ['/warning.mp3']
});
  export const beetleSound = new Howl({
    src: ['/beetle.mp3']
});
  export const buzzSound = new Howl({
    src: ['/buzz.mp3'],
    volume: 0.3
});
  export const creepyDoorSound = new Howl({
    src: ['/creepydoor.mp3'],
    volume: 0.7
});