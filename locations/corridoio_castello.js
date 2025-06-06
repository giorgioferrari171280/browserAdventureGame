window.currentLocationData = {
  locationInfo: {
    id: 'corridoio_castello',
    name: 'Corridoio del Castello',
    description: 'Un lungo corridoio illuminato da torce.',
    image: ''
  },
  pointsOfInterest: ['Porta Nord', 'Porta Est', 'Porta Ovest', 'Droide'],
  initialInventory: [],
  movements: {
    vaiSud: 'Ritorni alla cella del prigioniero.',
    vaiNord: 'Procedi verso la biblioteca.',
    default: 'Non puoi andare da quella parte.'
  },
  interactions: {
    'GUARDA_Droide': 'Un droide di sorveglianza dall\'aspetto severo.',
    'PARLA_Droide': () => {
      if (window.DialogueManager) {
        window.DialogueManager.playDialogue('droide_xc1230');
      }
    }
  },
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
