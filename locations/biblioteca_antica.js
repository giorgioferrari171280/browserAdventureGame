window.currentLocationData = {
  locationInfo: {
    id: 'biblioteca_antica',
    name: 'Biblioteca Antica',
    description: 'Scaffali colmi di tomi polverosi circondano la stanza.',
    image: ''
  },
  pointsOfInterest: ['Scaffali', 'Leggio'],
  initialInventory: [],
  movements: {
    vaiSud: 'Torna al corridoio del castello.',
    default: 'Non puoi andare da quella parte.'
  },
  interactions: {},
  effects: {},
  systemMessages: {
    verbSelected: 'Hai scelto {verb}.',
    firstTargetSelected: 'Hai selezionato {target}.',
    operationCancelled: 'Operazione annullata.',
    cannotDoThat: 'Non succede nulla.',
    escapeMessages: {
      ESCAPE_DOOR: '',
      ESCAPE_TUNNEL: '',
      ESCAPE_WINDOW: ''
    }
  },
  flags: {}
};
