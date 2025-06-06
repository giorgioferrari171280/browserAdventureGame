(function() {
  // Elementi DOM principali
  const MenuDestro = document.getElementById('MenuDestro');
  const MenuSinistro = document.getElementById('MenuSinistro');
  const BoxTesto = document.getElementById('BoxTesto');
  const ContenutoPrincipale = document.getElementById('ContenutoPrincipale');
  const sceneImage = document.getElementById('sceneImage');
  const defaultContent = document.getElementById('defaultContent');
  const actionButtons = Array.from(document.querySelectorAll('.button-group button'));
  const cancelButton = document.getElementById('cancelButton');
  
  // Pulsanti di interazione
  const usaButton = document.getElementById('usaButton');
  const guardaButton = document.getElementById('guarda');
  const prendiButton = document.getElementById('prendi');
  const parlaButton = document.getElementById('parla');
  const saltaButton = document.getElementById('salta');
  const leggiButton = document.getElementById('leggi');
  const spostaButton = document.getElementById('sposta');
  const indossaButton = document.getElementById('indossa');
  const spingiButton = document.getElementById('spingi');
  const tiraButton = document.getElementById('tira');
  
  // Pulsanti di movimento (azioni immediate)
  const movementButtons = document.querySelectorAll('#movementGroup button');
  
  // Pulsanti di interazione (richiedono target)
const interactionButtons = [usaButton, guardaButton, prendiButton, parlaButton,
                             saltaButton, leggiButton, spostaButton, indossaButton,
                             spingiButton, tiraButton];

  // Pulsanti speciali
  const mainMenuButton = document.getElementById('mainMenuBtn');
  const audioToggleButton = document.getElementById('audioToggle');
  const volumeSlider = document.getElementById('volumeSlider');

  let audioEnabled = true;
  let volumeLevel = 1.0;

  let currentVerb = null;     // Verbo selezionato (e.g. "USA", "GUARDA")
  let useFirstTarget = null;  // Primo oggetto scelto quando currentVerb === 'USA'
  let selectedButton = null;  // Riferimento al pulsante verbo attualmente selezionato
  let selectedTargets = [];   // Array dei pulsanti target selezionati

  // Controlla se il gioco è pronto (ha gameData caricato)
  function isGameReady() {
    return typeof window.gameData !== 'undefined' && window.gameData !== null;
  }

  // Mostra messaggio di stato
  function showStatus(message, isError = false) {
    if (BoxTesto) {
      BoxTesto.textContent = message;
      BoxTesto.style.color = isError ? '#cc3333' : '#111';
    }
    console.log(isError ? `❌ ${message}` : `ℹ️ ${message}`);
  }

  // Inizializzazione del gioco
  function initializeGame() {
    if (!isGameReady()) {
      showStatus("⏳ In attesa di dati di gioco...", false);
      // Nascondi l'immagine e mostra il contenuto di default
      if (sceneImage) sceneImage.style.display = 'none';
      if (defaultContent) defaultContent.style.display = 'block';
      return false; // Inizializzazione fallita
    }

    try {
      // Nascondi contenuto di default e mostra l'immagine
      if (defaultContent) defaultContent.style.display = 'none';
      if (sceneImage) sceneImage.style.display = 'block';

      // Imposta la location corrente nel GameState se disponibile
      if (window.GameState && window.gameData.locationInfo) {
        window.GameState.currentLocation = window.gameData.locationInfo.id;
        window.GameState.saveToStorage();
      }
      
      loadScene();
      loadInventory();
      loadPointsOfInterest();
      
      // Mostra la descrizione iniziale
      if (window.gameData.locationInfo) {
        showStatus(window.gameData.locationInfo.description);
        
        // Imposta il titolo della pagina
        document.title = window.gameData.locationInfo.name;
        
        // Imposta colore di sfondo se specificato
        if (window.gameData.locationInfo.backgroundColor) {
          document.body.style.backgroundColor = window.gameData.locationInfo.backgroundColor;
        }
      }

      console.log(`✅ Gioco inizializzato: ${window.gameData.locationInfo?.name || 'Sconosciuto'}`);
      return true; // Inizializzazione riuscita
    } catch (error) {
      console.error('❌ Errore nell\'inizializzazione del gioco:', error);
      showStatus("❌ Errore nel caricamento del gioco. Controlla la console per dettagli.", true);
      return false;
    }
  }

  // Carica la scena corrente
  function loadScene() {
    if (!isGameReady() || !window.gameData.locationInfo) return;
    
    const locationInfo = window.gameData.locationInfo;
    if (locationInfo.image && sceneImage) {
      sceneImage.src = locationInfo.image;
      sceneImage.alt = locationInfo.name;
      sceneImage.onerror = function() {
        console.warn(`⚠️ Immagine non trovata: ${locationInfo.image}`);
        this.style.display = 'none';
        if (defaultContent) {
          defaultContent.style.display = 'block';
          defaultContent.innerHTML = `
            <h2>🎮 ${locationInfo.name}</h2>
            <p>${locationInfo.description}</p>
            <p><small>Immagine: ${locationInfo.image} (non trovata)</small></p>
          `;
        }
      };
      sceneImage.onload = function() {
        console.log(`🖼️ Immagine caricata: ${locationInfo.image}`);
      };
    }
  }

  // Carica l'inventario 
  function loadInventory() {
    if (window.GameState) {
      // Usa solo il GameState - l'inventario è già stato caricato/inizializzato
      window.GameState.updateInventoryInterface();
    } else {
      // Fallback al sistema locale (se non c'è GameState)
      MenuDestro.innerHTML = '';
      
      if (window.gameData && window.gameData.initialInventory) {
        window.gameData.initialInventory.forEach(item => {
          addToInventory(item);
        });
      }
    }
  }

  // Carica i punti di interesse
  function loadPointsOfInterest() {
    MenuSinistro.innerHTML = ''; // Pulisce i POI esistenti
    
    window.gameData.pointsOfInterest.forEach(poi => {
      addPointOfInterest(poi);
    });
  }

  // Aggiunge un singolo punto di interesse
  function addPointOfInterest(poiName) {
    const button = document.createElement('button');
    button.className = 'left-button';
    button.textContent = poiName;
    button.addEventListener('click', onTargetClick);
    MenuSinistro.appendChild(button);
  }

  // Rimuove un punto di interesse
  function removePointOfInterest(poiName) {
    const buttons = MenuSinistro.querySelectorAll('.left-button');
    buttons.forEach(btn => {
      if (btn.textContent.trim() === poiName) {
        btn.remove();
      }
    });
  }

  // Funzione per rimuovere un oggetto dall'inventario  
  function removeFromInventory(itemName) {
    if (window.GameState) {
      window.GameState.removeItem(itemName);
    } else {
      // Fallback al sistema locale
      const buttons = MenuDestro.querySelectorAll('.inventory-button');
      buttons.forEach(btn => {
        if (btn.textContent.trim() === itemName) {
          btn.remove();
        }
      });
    }
  }

  // Funzione per aggiungere un oggetto all'inventario
  function addToInventory(itemName) {
    if (window.GameState) {
      window.GameState.addItem(itemName);
    } else {
      // Fallback al sistema locale
      const newButton = document.createElement('button');
      newButton.className = 'inventory-button';
      newButton.textContent = itemName;
      newButton.addEventListener('click', onTargetClick);
      MenuDestro.appendChild(newButton);
      updateInventoryListeners();
    }
  }

  // Abilita/disabilita i pulsanti di interazione (non quelli di movimento)
  function setActionButtonsEnabled(enabled) {
    interactionButtons.forEach(btn => {
      if (!enabled) {
        btn.disabled = true;
      } else {
        btn.disabled = false;
      }
    });
  }

  // Rimuove la classe "selected" da tutti i pulsanti di interazione
  function clearSelectedButtons() {
    interactionButtons.forEach(btn => {
      btn.classList.remove('selected');
    });
    selectedButton = null;
  }

  // Seleziona un target (POI o inventario)
  function selectTarget(targetButton) {
    targetButton.classList.add('selected');
    selectedTargets.push(targetButton);
  }

  // Rimuove la selezione da tutti i target
  function clearSelectedTargets() {
    selectedTargets.forEach(btn => {
      btn.classList.remove('selected');
    });
    selectedTargets = [];
  }

  // Aggiorna volume su tutti gli elementi audio
  function setGlobalVolume(level) {
    const audios = document.querySelectorAll('audio');
    audios.forEach(a => {
      try {
        a.volume = level;
      } catch (e) {}
    });
    volumeLevel = level;
  }

  function updateAudioUI() {
    if (!audioToggleButton || !volumeSlider) return;
    audioToggleButton.textContent = audioEnabled ? '🔊' : '🔇';
    volumeSlider.disabled = !audioEnabled;
    if (audioEnabled) {
      setGlobalVolume(volumeSlider.value / 100);
    } else {
      setGlobalVolume(0);
    }
  }

  // Gestione per i pulsanti di movimento (azioni immediate o cambio location)
  async function onMovementClick(evt) {
    const buttonId = evt.currentTarget.id;

    // Se non abbiamo dati di gioco, non possiamo muoverci
    if (!isGameReady()) {
      showStatus("⚠️ Dati di gioco non disponibili per il movimento", true);
      return;
    }

    // Gestione speciale per "ESCI" dalla cella
    if (buttonId === 'esci' && window.GameState) {
      if (window.GameState.hasFlag('porta_aperta')) {
        if (window.LocationManager && window.LocationManager.currentLocationId) {
          await window.LocationManager.executeMovement('ESCAPE_DOOR');
        } else if (window.gameData.movements && window.gameData.movements.ESCAPE_DOOR) {
          showStatus(window.gameData.movements.ESCAPE_DOOR);
        } else {
          showStatus('Esci dalla cella.');
        }
        return;
      }
    }

    let response = '';
    
    // Se esiste il LocationManager, prova prima il movimento tra location
    if (window.LocationManager && window.LocationManager.currentLocationId) {
      try {
        const movementExecuted = await window.LocationManager.executeMovement(buttonId);
        
        if (movementExecuted) {
          // Il movimento è stato eseguito, la location è cambiata
          return;
        }
      } catch (error) {
        console.error('❌ Errore nel movimento tra location:', error);
        showStatus("❌ Errore nel cambio location", true);
        return;
      }
    }
    
    // Se il movimento non è stato gestito dal LocationManager, usa i testi locali
    if (window.gameData.movements) {
      response = window.gameData.movements[buttonId] || window.gameData.movements.default;
    } else {
      response = `Non puoi andare in quella direzione (comando: ${buttonId})`;
    }
    
    showStatus(response);
  }

  // Quando l'utente clicca su un verbo (solo per interazioni)
  function onVerbClick(evt) {
    if (!isGameReady()) {
      showStatus("⚠️ Dati di gioco non disponibili per le interazioni", true);
      return;
    }
    
    const verbId = evt.currentTarget.id;
    
    // Rimuovi selezione precedente e seleziona il nuovo pulsante
    clearSelectedButtons();
    evt.currentTarget.classList.add('selected');
    selectedButton = evt.currentTarget;
    
    // Imposta currentVerb in base all'id
    switch(verbId) {
      case 'guarda':
        currentVerb = 'GUARDA';
        break;
      case 'usaButton':
        currentVerb = 'USA';
        break;
      case 'prendi':
        currentVerb = 'PRENDI';
        break;
      case 'parla':
        currentVerb = 'PARLA';
        break;
      case 'salta':
        currentVerb = 'SALTA';
        break;
      case 'leggi':
        currentVerb = 'LEGGI';
        break;
      case 'sposta':
        currentVerb = 'SPOSTA';
        break;
      case 'indossa':
        currentVerb = 'INDOSSA';
        break;
      case 'spingi':
        currentVerb = 'SPINGI';
        break;
      case 'tira':
        currentVerb = 'TIRA';
        break;
      default:
        currentVerb = verbId.toUpperCase();
    }

    // Disabilitiamo tutti i pulsanti di azione (tranne X),
    // mostriamo "X" e chiediamo di scegliere un target
    setActionButtonsEnabled(false);
    cancelButton.classList.remove('hidden');
    useFirstTarget = null; // Reset flusso per "USA"
    
    const message = window.gameData.systemMessages?.verbSelected?.replace('{verb}', currentVerb) ||
                   `Hai selezionato "${currentVerb}". Scegli un target.`;
    showStatus(message);
  }

  // Ripristina lo stato iniziale (nessun verbo selezionato)
  function resetVerbState() {
    currentVerb = null;
    useFirstTarget = null;
    cancelButton.classList.add('hidden');
    clearSelectedButtons();
    clearSelectedTargets(); // Pulisce anche i target selezionati
    setActionButtonsEnabled(true);
  }

  // Listener per il pulsante "X" (annulla)
  cancelButton.addEventListener('click', () => {
    resetVerbState();
    const message = window.gameData?.systemMessages?.operationCancelled || "Operazione annullata.";
    showStatus(message);
  });

  // Gestione click sui target (POI a sinistra o oggetti inventario a destra)
  function onTargetClick(evt) {
    if (!currentVerb) return; // Se non c'è un verbo selezionato, ignora
    
    if (!isGameReady()) {
      showStatus("⚠️ Dati di gioco non disponibili per le interazioni", true);
      resetVerbState();
      return;
    }

    const targetText = evt.currentTarget.textContent.trim();
    const targetButton = evt.currentTarget;
    
    // Se il verbo è "USA", dobbiamo gestire due fasi: primo e secondo target
    if (currentVerb === 'USA') {
      if (!useFirstTarget) {
        // Prima scelta: memorizzo il primo oggetto e lo evidenzio
        useFirstTarget = targetText;
        selectTarget(targetButton);
        const message = window.gameData.systemMessages?.firstTargetSelected?.replace('{target}', useFirstTarget) ||
                       `Hai scelto "${useFirstTarget}". Ora seleziona con cosa usarlo.`;
        showStatus(message);
        return;
      } else {
        // Seconda scelta: evidenzio anche il secondo target e compongo "USA X con Y"
        selectTarget(targetButton);
        const first = useFirstTarget;
        const second = targetText;
        
        // Cerca la combinazione nell'oggetto interactions
        const combinationKey1 = `USA_${first}_${second}`;
        const combinationKey2 = `USA_${second}_${first}`;
        
        let response = '';
        if (window.gameData.interactions) {
          response = window.gameData.interactions[combinationKey1] || 
                    window.gameData.interactions[combinationKey2] || 
                    window.gameData.systemMessages?.cannotDoThat ||
                    "Non credo di poterlo fare";
        } else {
          response = "Dati di interazioni non disponibili";
        }
        
        // Applica effetti speciali se esistono
        if (window.gameData.effects) {
          const effect = window.gameData.effects[combinationKey1] || window.gameData.effects[combinationKey2];
          if (effect) {
            applyEffect(effect);
          }
        }

        showStatus(response);
        resetVerbState();
        return;
      }
    }

    // Se il verbo NON è "USA", evidenzia il target e gestisci combinazioni singole
    selectTarget(targetButton);
    
    // Cerca l'interazione nell'oggetto interactions
    const interactionKey = `${currentVerb}_${targetText}`;
    let response = '';
    
    if (window.gameData.interactions) {
      response = window.gameData.interactions[interactionKey] || 
                window.gameData.systemMessages?.cannotDoThat ||
                "Non credo di poterlo fare";
    } else {
      response = "Dati di interazioni non disponibili";
    }
    
    // Applica effetti speciali se esistono
    if (window.gameData.effects) {
      const effect = window.gameData.effects[interactionKey];
      if (effect) {
        applyEffect(effect);
      }
    }
    
    showStatus(response);
    resetVerbState();
  }

  // Applica effetti speciali (aggiunge/rimuove oggetti, imposta flag, azioni speciali)
  function applyEffect(effect) {
    if (window.GameState) {
      // Sistema GameState semplificato
      
      // Aggiungi oggetti
      if (effect.addItems) {
        effect.addItems.forEach(item => {
          window.GameState.addItem(item);
        });
      }
      
      // Rimuovi oggetti
      if (effect.removeItems) {
        effect.removeItems.forEach(item => {
          window.GameState.removeItem(item);
        });
      }
      
      // Imposta flag (semplice presenza/assenza)
      if (effect.setFlags) {
        Object.keys(effect.setFlags).forEach(flagName => {
          if (effect.setFlags[flagName]) {
            window.GameState.setFlag(flagName);
          }
        });
      }
      
    } else {
      // Fallback al sistema locale
      if (effect.removeItems) {
        effect.removeItems.forEach(item => {
          removeFromInventory(item);
        });
      }
      
      if (effect.addItems) {
        effect.addItems.forEach(item => {
          addToInventory(item);
        });
      }
      
      if (effect.setFlags) {
        Object.keys(effect.setFlags).forEach(flag => {
          if (window.gameData.flags) {
            window.gameData.flags[flag] = effect.setFlags[flag];
          }
        });
      }
    }
    
    // Gestisci interfaccia (sempre)
    if (effect.hidePoI) {
      effect.hidePoI.forEach(poi => {
        removePointOfInterest(poi);
      });
    }
    
    if (effect.addPoI) {
      effect.addPoI.forEach(poi => {
        addPointOfInterest(poi);
      });
    }
    
    // Esegui azioni speciali (sempre)
    if (effect.specialAction) {
      executeSpecialAction(effect.specialAction);
    }
  }

  // Esegue azioni speciali come vincere il gioco o cambiare location
  function executeSpecialAction(action) {
    const escapeMessages = window.gameData.systemMessages.escapeMessages;
    
    switch(action) {
      case 'ESCAPE_DOOR':
        setTimeout(() => {
          alert(escapeMessages.ESCAPE_DOOR);
          // Se c'è LocationManager, cambia location invece di mostrare vittoria
          if (window.LocationManager) {
            window.LocationManager.executeMovement('ESCAPE_DOOR');
          } else {
            showVictoryScreen();
          }
        }, 1000);
        break;
        
      case 'ESCAPE_WINDOW':
        setTimeout(() => {
          alert(escapeMessages.ESCAPE_WINDOW);
          if (window.LocationManager) {
            window.LocationManager.executeMovement('ESCAPE_WINDOW');
          } else {
            showVictoryScreen();
          }
        }, 1000);
        break;
        
      case 'ESCAPE_TUNNEL':
        setTimeout(() => {
          alert(escapeMessages.ESCAPE_TUNNEL);
          if (window.LocationManager) {
            window.LocationManager.executeMovement('ESCAPE_TUNNEL');
          } else {
            showVictoryScreen();
          }
        }, 1000);
        break;
        
      case 'OPEN_SECRET_PASSAGE':
        BoxTesto.textContent = "Un passaggio segreto si apre nel muro! Ora puoi esplorare nuove aree.";
        // Aggiorna la visualizzazione se necessario
        break;
        
      default:
        console.log('Azione speciale non riconosciuta:', action);
    }
  }

  // Mostra schermata di vittoria
  function showVictoryScreen() {
    ContenutoPrincipale.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #2e7d32;">
        <h1 style="color: #4caf50; font-size: 3rem; margin-bottom: 1rem;">🎉 VITTORIA! 🎉</h1>
        <h2 style="color: #388e3c; margin-bottom: 2rem;">Sei riuscito a fuggire!</h2>
        <p style="font-size: 1.2rem; line-height: 1.6; max-width: 500px; margin: 0 auto;">
          Congratulazioni! Hai trovato un modo per uscire dalla cella e ottenere la libertà. 
          La tua avventura di fuga è stata un successo!
        </p>
        <button onclick="location.reload()" 
                style="margin-top: 2rem; padding: 1rem 2rem; font-size: 1.2rem; 
                       background: #4caf50; color: white; border: none; border-radius: 8px; 
                       cursor: pointer;">
          Gioca di nuovo
        </button>
      </div>
    `;
    
    // Disabilita tutti i controlli
    setActionButtonsEnabled(false);
    movementButtons.forEach(btn => btn.disabled = true);
    
    BoxTesto.textContent = "🎊 Complimenti! Hai completato la sfida di fuga! 🎊";
  }

  // Assegno i listener ai pulsanti di movimento (azioni immediate)
  movementButtons.forEach(btn => {
    btn.addEventListener('click', onMovementClick);
  });
  
  // Assegno i listener ai pulsanti di interazione (richiedono target)
  interactionButtons.forEach(btn => {
    btn.addEventListener('click', onVerbClick);
  });

  if (mainMenuButton) {
    mainMenuButton.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  if (audioToggleButton) {
    audioToggleButton.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      updateAudioUI();
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      if (audioEnabled) {
        setGlobalVolume(volumeSlider.value / 100);
      }
    });
  }

  updateAudioUI();

  // Assegno i listener al popup di inventario (destra) e POI (sinistra)
  function updateInventoryListeners() {
    const currentInventoryButtons = Array.from(MenuDestro.querySelectorAll('.inventory-button'));
    currentInventoryButtons.forEach(btn => {
      // Rimuovi listener esistenti per evitare duplicati
      btn.removeEventListener('click', onTargetClick);
      btn.removeEventListener('click', onInventoryClick);
      // Aggiungi il listener appropriato
      if (window.GameState) {
        btn.addEventListener('click', onInventoryClick);
      } else {
        btn.addEventListener('click', onTargetClick);
      }
    });
  }

  // Gestione click sull'inventario 
  function onInventoryClick(evt) {
    // Usa la stessa logica di onTargetClick
    onTargetClick(evt);
  }

  // Inizializza il sistema (LocationManager o gioco singolo)
  async function initializeGameSystem() {
    console.log("🎮 Inizializzazione sistema di gioco...");
    
    // Attendi un momento per assicurarti che tutti gli script siano caricati
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (window.LocationManager) {
      // Sistema multi-location
      console.log("🗺️ Inizializzando sistema multi-location");
      try {
        await window.LocationManager.initialize();
      } catch (error) {
        console.error("❌ Errore nell'inizializzazione LocationManager:", error);
        showStatus("❌ Errore nel caricamento del sistema multi-location", true);
      }
    } else if (isGameReady()) {
      // Gioco singola location
      console.log("🏠 Inizializzando gioco singola location");
      const success = initializeGame();
      if (!success) {
        showStatus("❌ Errore nell'inizializzazione del gioco singola location", true);
      }
    } else {
      // Nessun dato disponibile
      console.warn("⚠️ Nessun sistema di gioco disponibile");
      showStatus("⚠️ Nessun file di gioco caricato. Verifica la configurazione.", true);
      
      // Mostra istruzioni di debug
      if (defaultContent) {
        defaultContent.innerHTML = `
          <h2>⚠️ Configurazione Gioco</h2>
          <p>Nessun file di dati caricato. Controlla:</p>
          <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
            <li>✅ <code>items.js</code> - Database oggetti</li>
            <li>✅ <code>gameState.js</code> - Sistema di stato</li>
            <li>❓ <code>data.js</code> - Per gioco singola location</li>
            <li>❓ <code>locationManager.js</code> - Per gioco multi-location</li>
          </ul>
          <p><small>Apri la console (F12) per maggiori dettagli.</small></p>
        `;
      }
    }
  }

  // Inizializza il gioco quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGameSystem);
  } else {
    initializeGameSystem();
  }

  // Esponi interfaccia per LocationManager e GameState
  window.gameInterface = {
    initializeGame: initializeGame,
    loadScene: loadScene,
    loadInventory: loadInventory, 
    loadPointsOfInterest: loadPointsOfInterest,
    addToInventory: addToInventory,
    removeFromInventory: removeFromInventory,
    addPointOfInterest: addPointOfInterest,
    removePointOfInterest: removePointOfInterest,
    updateInventoryListeners: updateInventoryListeners,
    onInventoryClick: onInventoryClick, // Per GameState
    onTargetClick: onTargetClick, // Per compatibilità
    showMessage: showStatus,
    showVictoryScreen: showVictoryScreen,
    resetVerbState: resetVerbState,
    applyEffect: applyEffect,
    isGameReady: isGameReady
  };

  // Funzioni di utilità per debug (semplificate)
  window.gameDebug = {
    showCurrentLocation: () => {
      if (window.LocationManager) {
        window.LocationManager.debugState();
      }
      if (isGameReady()) {
        console.log("📊 Dati location corrente:", window.gameData);
      } else {
        console.warn("⚠️ Nessun dato di gioco disponibile");
      }
    },
    showInventory: () => {
      if (window.GameState) {
        console.log("🎒 Inventario:", window.GameState.inventory);
      } else {
        const items = Array.from(document.querySelectorAll('#MenuDestro .inventory-button'))
                          .map(btn => btn.textContent.trim());
        console.log("🎒 Inventario attuale:", items);
      }
    },
    showFlags: () => {
      if (window.GameState) {
        console.log("🚩 Flag attivi:", Object.keys(window.GameState.flags));
      } else if (isGameReady() && window.gameData.flags) {
        console.log("🚩 Flag attuali:", window.gameData.flags);
      } else {
        console.warn("⚠️ Nessun sistema di flag disponibile");
      }
    },
    addItem: (itemName) => {
      if (window.GameState) {
        window.GameState.addItem(itemName);
      } else {
        console.warn("⚠️ GameState non disponibile");
      }
    },
    setFlag: (flagName) => {
      if (window.GameState) {
        window.GameState.setFlag(flagName);
      } else {
        console.warn("⚠️ GameState non disponibile");
      }
    },
    reinitialize: () => {
      console.log("🔄 Reinizializzazione...");
      initializeGameSystem();
    }
  };

  console.log("🎮 Script del gioco caricato. Usa 'gameDebug' per comandi di debug.");
})();