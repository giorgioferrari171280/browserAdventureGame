window.currentLocationData = {
  locationInfo: {
    id: 'cella_prigioniero',
    name: 'Cella del Prigioniero',
    description: 'Ti trovi in una piccola cella fredda e umida.',
    image: 'assets/images/locations/cella.png'
  },
  pointsOfInterest: [
    'Letto',
    'Cuscino',
    'Armadietto sul muro',
    'Porta',
    'Finestra',
    'Secchio',
    'Mucchio di paglia'
  ],
  initialInventory: [],
  // Messaggi associati ai pulsanti di movimento e ad azioni speciali
  // "esci" sarà efficace solo dopo aver aperto la porta
  movements: {
    ESCAPE_DOOR: 'Apri con fatica la porta e ti ritrovi nel corridoio.',
    ESCAPE_TUNNEL: 'Strisci nel tunnel verso il giardino segreto.',
    ESCAPE_WINDOW: 'Le sbarre ti impediscono di uscire dalla finestra.',
    esci: 'La porta è chiusa.',
    default: 'Non puoi andare in quella direzione.'
  },
  // Ogni punto di interesse necessita di un'interazione esplicita
  // altrimenti il gioco mostrerà il messaggio di default.
  interactions: {
    'GUARDA_Letto': 'Il materasso è logoro. Tra le coperte intravedi qualcosa che luccica.',
    'GUARDA_Cuscino': 'Un vecchio cuscino di paglia, ormai consumato.',
    'GUARDA_Armadietto sul muro': 'Un piccolo armadietto fissato al muro, la porta è socchiusa.',
    'SPOSTA_Cuscino': 'Spostando il cuscino salta fuori una piccola chiave.',
    'GUARDA_Porta': 'Una pesante porta di legno con una piccola feritoia.',
    'GUARDA_Finestra': 'La finestra è piccola e protetta da solide sbarre.',
    'GUARDA_Secchio': "Un vecchio secchio arrugginito pieno d'acqua stagnante.",
    'GUARDA_Mucchio di paglia': 'Un mucchio di paglia sparso per terra.',
    // Usa la chiave trovata sotto il cuscino per sbloccare la porta
    'USA_Chiave_Porta': 'La chiave gira nella serratura con un clic.'
  },
  effects: {
    'SPOSTA_Cuscino': { addItems: ['Chiave'] },
    'GUARDA_Letto': { addItems: ['Pistola Laser HF-27'] },
    'USA_Chiave_Porta': {
      removeItems: ['Chiave'],
      setFlags: { porta_aperta: true }
    }
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
