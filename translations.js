const Translations = {
  it: {
    new_game: 'Nuova Partita',
    load_game: 'Carica Partita',
    options: 'Opzioni',
    credits: 'Credits',
    quit_game: 'Esci dal Gioco',
    back: 'Indietro',
    start: 'Avvia',
    cancel: 'Annulla',
    save_name: 'Nome salvataggio',
    audio: 'AUDIO',
    language: 'LINGUA',
    close: 'CHIUDI',
    ok: 'OK',
    main_menu: 'MENU PRINCIPALE',
    map_title: 'MAPPA',
    go_here: 'VAI QUI',
    welcome_msg: "Benvenuto! Seleziona un'azione per iniziare l'avventura.",
    inventory_title: 'Inventario',
    poi_title: 'Punti di interesse',
    quests_title: 'QUESTS',
    achievements_title: 'ACHIEVEMENTS',
    journal_title: 'JOURNAL'
  },
  en: {
    new_game: 'New Game',
    load_game: 'Load Game',
    options: 'Options',
    credits: 'Credits',
    quit_game: 'Quit Game',
    back: 'Back',
    start: 'Start',
    cancel: 'Cancel',
    save_name: 'Save Name',
    audio: 'AUDIO',
    language: 'LANGUAGE',
    close: 'CLOSE',
    ok: 'OK',
    main_menu: 'MAIN MENU',
    map_title: 'MAP',
    go_here: 'GO HERE',
    welcome_msg: 'Welcome! Select an action to start your adventure.',
    inventory_title: 'Inventory',
    poi_title: 'Points of interest',
    quests_title: 'QUESTS',
    achievements_title: 'ACHIEVEMENTS',
    journal_title: 'JOURNAL'
  }
};

const LanguageManager = {
  current: localStorage.getItem('gameLanguage') || 'it',
  apply() {
    const lang = this.current;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const txt = Translations[lang][key];
      if (txt) el.textContent = txt;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const txt = Translations[lang][key];
      if (txt) el.placeholder = txt;
    });
  },
  set(lang) {
    this.current = lang;
    localStorage.setItem('gameLanguage', lang);
    this.apply();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  LanguageManager.apply();
});
