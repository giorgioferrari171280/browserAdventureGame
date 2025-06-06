window.currentLocationData = {
  locationInfo: {
    id: 'cella_prigioniero',
    name: 'Cella del Prigioniero',
    description: 'Ti trovi in una piccola cella fredda e umida.',
    image: ''
  },
  pointsOfInterest: ['Porta', 'Pagliericcio'],
  initialInventory: ['Cucchiaio arrugginito'],
  movements: {
    ESCAPE_DOOR: 'Apri con fatica la porta e ti ritrovi nel corridoio.',
    ESCAPE_TUNNEL: 'Strisci nel tunnel verso il giardino segreto.',
    ESCAPE_WINDOW: 'Le sbarre ti impediscono di uscire dalla finestra.',
    default: 'Non puoi andare in quella direzione.'
  },
  interactions: {
    'GUARDA_Porta': 'La porta sembra robusta ma un po\' usurata.'
  },
  effects: {},
  systemMessages: {
    verbSelected: 'Hai scelto {verb}.',
    firstTargetSelected: 'Hai selezionato {target}.',
    operationCancelled: 'Operazione annullata.',
    cannotDoThat: 'Non succede nulla.',
    escapeMessages: {
      ESCAPE_DOOR: 'Esci dalla cella attraverso la porta.',
      ESCAPE_TUNNEL: 'Ti infili nel tunnel di fuga.',
      ESCAPE_WINDOW: 'La finestra è troppo stretta.'
    }
  },
  flags: {}
};
