window.currentLocationData = {
  locationInfo: {
    id: 'giardino_segreto',
    name: 'Giardino Segreto',
    description: 'Un piccolo giardino nascosto tra le mura.',
    image: '',
    coordinates: 'B1'
  },
  pointsOfInterest: ['Statua', 'Fontana'],
  initialInventory: [],
  movements: {
    dentro: 'Rientri nella cella del prigioniero.',
    nord: 'Un sentiero porta verso il bosco oltre il giardino.',
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
