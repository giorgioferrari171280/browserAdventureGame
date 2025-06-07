window.currentLocationData = {
  locationInfo: {
    id: 'cella_prigioniero',
    name: 'Cella del Prigioniero',
    description: 'Ti trovi in una piccola cella fredda e umida.',
    image: 'assets/images/locations/cella.png'
  },
  pointsOfInterest: [
    'Porta',
    'Pagliericcio',
    'Secchio',
    'Finestra',
    'Muro Nord',
    'Muro Sud',
    'Muro Est',
    'Muro Ovest',
    'Lanterna Spenta',
    'Tavola Sconnessa'
  ],
  initialInventory: [
    'Cucchiaio arrugginito',
    'Straccio sporco',
    'Pezzo di pane secco',
    'Sassolino',
    'Chiodo piegato',
    'Lima',
    'Corda',
    'Candela',
    'Lanterna',
    'Mappa'
  ],
  movements: {
    ESCAPE_DOOR: 'Apri con fatica la porta e ti ritrovi nel corridoio.',
    ESCAPE_TUNNEL: 'Strisci nel tunnel verso il giardino segreto.',
    ESCAPE_WINDOW: 'Le sbarre ti impediscono di uscire dalla finestra.',
    esci: 'La porta è chiusa.',
    default: 'Non puoi andare in quella direzione.'
  },
  interactions: {
    'GUARDA_Porta': 'La porta sembra robusta ma un po\' usurata.',
    'SPOSTA_Pagliericcio': 'Hai trovato una chiave nascosta sotto la paglia!',
    'USA_Chiave_Porta': 'La chiave gira nella serratura e si spezza ma ora la porta è aperta! Puoi uscire...'
  },
  effects: {
    'SPOSTA_Pagliericcio': { addItems: ['Chiave'] },
    'USA_Chiave_Porta': { removeItems: ['Chiave'], setFlags: { porta_aperta: true } }
  },
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
