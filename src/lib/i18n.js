// --- NEW WAY: Read from environment variable ---
// It will default to 'en' if VITE_LANGUAGE is not set during the build.
export const CURRENT_LANG = import.meta.env.VITE_LANGUAGE || "fr";
// -----------------------------------------------

// Log the current language to the console during build
console.log(`Building with language: ${CURRENT_LANG}`);

// 1. TEXT TRANSLATIONS
// ===================================
const translations = {
  // --- English Text ---
  en: {
    title: "Where Trick or Treat Meets Escape&nbsp;Room",
    tagline: "Solve the puzzles. Claim the candy… if you dare.",
    headphones_recommended: "Headphones Recommended",
    start: "Start",
    // ...
    doorScene: {
      question:
        "Every other house on this street has been visited. Will&nbsp;you be its first trick or treater?",
      runAway: "Run away",
      goToDoor: "Go to door",
      modal_title: "You don't have the courage yet.",
      modal_body: "Take a few deep breaths.",
      modal_button: "OK",
    },
    door: {
      title: "Look around",
      slide_window: "Window",
      slide_sign: "Sign",
      slide_door: "Door",
      unlock_prompt: "Unlock Peephole",
    },
    bug: {
      title: "Peephole",
      unlock_prompt: "Unlock Doorbell",
    },
    knock: {
      main_title: "Trick or Treat",
      doorbell_prompt: "Ring The Doorbell",
      panel_subtitle: "Front Door",
      panel_title: "Secret Knock",
      panel_prompt: "A specific pattern is required.",
      button_reset: "Reset",
      button_knock: "Knock",
      message_granted: "ACCESS GRANTED",
      message_denied: "ACCESS DENIED",
      button_open: "Open Door",
    },
    // --- SECTION FOR INTRO FOOTER ---
    intro: {
      footer_button_text: "This game",
      footer_aria_label: "Show game information",
      footer_text_1: "was conjured by",
      mobile_escapes: "Mobile Escapes",
      footer_text_2: "and AI",
    },
    candy: {
      alt_text: "A pile of tempting Halloween candy",
      title: "Congratulations, you’ve escaped your fears.",
      subtitle: "Claim the candy…if you dare.",
      button: "Grab the candy",
    },
    conclusion: {
      alert_submit_error:
        "Sorry, there was an error submitting your score. Please try again.",
      alert_network_error:
        "A network error occurred. Please check your connection and try again.",
      share_text_1: "Hey! I solved this Trick of Treat game in",
      share_text_2: "! 💀 Try to beat my time… if you dare.",
      share_title: "Trick or Treat - Halloween Escape Room",
      alert_clipboard_copy: "Share link copied to clipboard!",
      congrats: "Congratulations! You deserve candy.",
      your_time: "Your Time:",
      time_subtitle: "Not bad for a mortal! 👻",
      button_share: "📱 Share with Friends",
      share_prompt:
        "Join the scaring party — challenge your friends to beat your time!",
      promo_alt: "Once in a Blue Moon escape room promo",
      promo_title: "🌙 Once in a Blue Moon",
      promo_desc:
        "Experience the ultimate Halloween escape room! Race to escape a spooky manor during a rare blue moon on October 31st. Perfect for team building and special events.",
      promo_tag_1: "Team Building",
      promo_tag_2: "Classrooms",
      promo_tag_3: "Corporate Events",
      promo_special: "🎃 Halloween Special!",
      promo_use_code: "Use code",
      promo_offer: "50% off for up to 20 players",
      promo_button: "Book Now",
      score_submitted: "✅ Score submitted successfully!",
      leaderboard_prompt: "Enter Your Name for the Leaderboard",
      leaderboard_placeholder: "Enter your spooky name...",
      leaderboard_submitting: "Submitting...",
      leaderboard_submit: "Submit Score",
      leaderboard_button: "🏆 Add to Leaderboard",
      leaderboard_title: "🏆 Leaderboard - Top Escapees",
      leaderboard_you: "← You!",
      button_play_again: "🎃 Play Again",
      footer_made_by_1: "Made with ❤️ in Ottawa by",
    },
  },

  // --- French Text ---
  fr: {
    title: "Évadez-vous cet Halloween",
    tagline: "Résolvez les énigmes. Réclamez les bonbons… si vous l'osez.",
    headphones_recommended: "Écouteurs Recommandés",
    start: "Commencer",
    // ...
    doorScene: {
      question:
        "Toutes les autres maisons de cette rue ont été visitées. Serez-vous son premier visiteur?",
      runAway: "Fuir",
      goToDoor: "Aller à la porte",
      modal_title: "Tu n'as pas encore le courage.",
      modal_body: "Prends quelques grandes respirations.",
      modal_button: "OK",
    },
    door: {
      title: "Regarde autour",
      slide_window: "Fenêtre",
      slide_sign: "Affiche",
      slide_door: "Porte",
      unlock_prompt: "Déverrouiller le judas",
    },
    bug: {
      title: "Œilleton ",
      unlock_prompt: "Déverrouiller la sonnette",
    },
    knock: {
      main_title: "Trick or Treat !",
      doorbell_prompt: "Sonnez à la porte",
      panel_subtitle: "Porte d'entrée",
      panel_title: "Code Secret",
      panel_prompt: "Un motif spécifique est requis.",
      button_reset: "Réinitialiser",
      button_knock: "Toquer",
      message_granted: "ACCÈS AUTORISÉ",
      message_denied: "ACCÈS REFUSÉ",
      button_open: "Ouvrir la porte",
    },
    intro: {
      footer_button_text: "Ce jeu",
      footer_aria_label: "Afficher les informations du jeu",
      footer_text_1: "a été conçu par",
      mobile_escapes: "Évasions Mobiles",
      footer_text_2: "et l'IA",
    },
    candy: {
      alt_text: "Un tas de bonbons d'Halloween tentants",
      title: "Félicitations, vous avez échappé à vos peurs.",
      subtitle: "Réclamez les bonbons… si vous l'osez.",
      button: "Prendre les bonbons",
    },
    conclusion: {
      alert_submit_error:
        "Désolé, une erreur s'est produite lors de la soumission de votre score. Veuillez réessayer.",
      alert_network_error:
        "Une erreur de réseau s'est produite. Veuillez vérifier votre connexion et réessayer.",
      share_text_1: "Hey! J'ai résolu ce jeu Trick of Treat en",
      share_text_2: "! 💀 Essaie de battre mon temps… si tu l'oses.",
      share_title: "Trick or Treat - Jeu d'évasion d'Halloween",
      alert_clipboard_copy: "Lien de partage copié dans le presse-papiers!",
      congrats: "Félicitations! Tu mérites des bonbons.",
      your_time: "Votre Temps:",
      time_subtitle: "Pas mal pour un mortel! 👻",
      button_share: "📱 Partager avec vos amis",
      share_prompt:
        "Rejoignez la fête effrayante — défiez vos amis de battre votre temps!",
      promo_alt: "Promo du jeu d'évasion Sous la lune bleue",
      promo_title: "🌙 Sous la lune bleue",
      promo_desc:
        "Vivez l'ultime jeu d'évasion d'Halloween! Tentez de vous échapper d'un manoir hanté lors d'une rare lune bleue le 31 octobre. Parfait pour la consolidation d'équipe et les événements spéciaux.",
      promo_tag_1: "Consolidation d'équipe",
      promo_tag_2: "Salles de classe",
      promo_tag_3: "Événements d'entreprise",
      promo_special: "🎃 Spécial Halloween!",
      promo_use_code: "Utilisez le code",
      promo_offer: "50% de réduction jusqu'à 20 joueurs",
      promo_button: "Réservez maintenant",
      score_submitted: "✅ Score soumis avec succès!",
      leaderboard_prompt: "Entrez votre nom pour le classement",
      leaderboard_placeholder: "Entrez votre nom effrayant...",
      leaderboard_submitting: "Soumission...",
      leaderboard_submit: "Soumettre",
      leaderboard_button: "🏆 Ajouter au classement",
      leaderboard_title: "🏆 Classement - Meilleurs Évadés",
      leaderboard_you: "← Vous!",
      button_play_again: "🎃 Jouer à nouveau",
      footer_made_by_1: "Fait avec ❤️ à Ottawa par",
    },
  },
};

export const TEXT = translations[CURRENT_LANG];

// 2. FILE PATHS
// ===================================

// Define all base (English) file paths here
const baseFilePaths = {
  // --- Audio ---
  music: "/music.mp3",
  click: "/click.mp3",
  unlock: "/unlock.mp3",
  incorrect: "/incorrect.mp3",
  first: "/first.mp3",
  deep: "/deep.mp3",
  knock: "/knock.mp3",
  dusty: "/dusty.mp3",
  warning: "/warning.mp3",
  beetle: "/beetle.mp3",
  buzz: "/buzz.mp3",
  creepydoor: "/creepydoor.mp3",
  congrats: "/congrats.wav",
  dingdong: "/dingdong.mp3",

  // --- Images ---
  windowImage: "/window5b.jpeg",
  signImage: "/sign.jpeg",
  doorImage: "/house3d.png",
  pathImage: "/path6.png",
  house3Image: "/house3.jpeg",
  knockerImage: "/knocker.png",
  candy: "/candy.png",

  // --- Videos ---
  houseopenVideo: "/houseopen.mp4",
  // ... add all other assets
};

// Define ONLY the paths that are DIFFERENT for French
const translatedFilePaths = {
  en: {}, // English uses the base paths by default
  fr: {
    first: "/fr/toutes.wav",
    warning: "/fr/attention.wav",
    deep: "/fr/tu.wav",
  },
};

// Export the final FILE object
// This starts with all English paths and overwrites any
// that are defined in the translatedFilePaths[CURRENT_LANG] object
export const FILE = {
  ...baseFilePaths,
  ...translatedFilePaths[CURRENT_LANG],
};
