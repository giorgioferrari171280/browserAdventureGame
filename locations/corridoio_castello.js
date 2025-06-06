window.currentLocationData = {
  locationInfo: {
    id: 'corridoio_castello',
    name: 'Corridoio del Castello',
    description: 'Un lungo corridoio illuminato da torce.',
    image: ''
  },
  pointsOfInterest: ['Porta Nord', 'Porta Est', 'Porta Ovest'],
  initialInventory: [],
  movements: {
    vaiSud: 'Ritorni alla cella del prigioniero.',
    vaiNord: 'Procedi verso la biblioteca.',
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
