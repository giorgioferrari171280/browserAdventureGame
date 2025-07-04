(function() {
  // Elementi DOM principali
  const MenuDestro = document.getElementById('MenuDestro');
  const MenuSinistro = document.getElementById('MenuSinistro');
  const InventoryList = document.getElementById('InventoryList');
  const PoiList = document.getElementById('PoiList');
  const transitionOverlay = document.getElementById('transitionOverlay');
  const BoxTesto = document.getElementById('BoxTesto');
  const ContenutoPrincipale = document.getElementById('ContenutoPrincipale');
  const sceneImage = document.getElementById('sceneImage');
  const defaultContent = document.getElementById('defaultContent');
  const actionButtons = Array.from(document.querySelectorAll('.button-group button'));
  const cancelButton = document.getElementById('cancelButton');

  // Elementi per il dialogo
  const dialogueOverlay = document.getElementById('dialogueOverlay');
  const dialogueImage = document.getElementById('dialogueImage');
  const dialogueText = document.getElementById('dialogueText');
  const dialogueOptions = document.getElementById('dialogueOptions');
  
  // Pulsanti di interazione
  const usaButton = document.getElementById('usaButton');
  const guardaButton = document.getElementById('guarda');
  const vaiButton = document.getElementById('vai');
  const prendiButton = document.getElementById('prendi');
  const parlaButton = document.getElementById('parla');
  const saltaButton = document.getElementById('salta');
  const leggiButton = document.getElementById('leggi');
  const spostaButton = document.getElementById('sposta');
  const indossaButton = document.getElementById('indossa');
  const spingiButton = document.getElementById('spingi');
  const tiraButton = document.getElementById('tira');
  const apriButton = document.getElementById('apri');
  const chiudiButton = document.getElementById('chiudi');
  
  // Pulsanti di movimento (azioni immediate)
  const movementButtons = document.querySelectorAll('#movementGroup button');
  
  // Pulsanti di interazione (richiedono target)
const interactionButtons = [vaiButton, usaButton, guardaButton, prendiButton, parlaButton,
                             saltaButton, leggiButton, spostaButton, indossaButton,
                             spingiButton, tiraButton, apriButton, chiudiButton];

  // Pulsanti speciali
  const mainMenuButton = document.getElementById('mainMenuBtn');
  const optionsMenuButton = document.getElementById('optionsMenuBtn');
  const audioToggleButton = document.getElementById('audioToggle');
  const volumeSlider = document.getElementById('volumeSlider');

  // Pulsanti missioni e journal
  const questsBtn = document.getElementById('questsBtn');
  const journalBtn = document.getElementById('journalBtn');
  const achievementsBtn = document.getElementById('achievementsBtn');

  // Overlay e pannelli
  const questsOverlay = document.getElementById('questsOverlay');
  const achievementsOverlay = document.getElementById('achievementsOverlay');
  const journalOverlay = document.getElementById('journalOverlay');
  const questCategories = document.getElementById('questCategories');
  const questList = document.getElementById('questList');
  const questDetails = document.getElementById('questDetails');
  const achievementsGrid = document.getElementById('achievementsGrid');
  const journalCategories = document.getElementById('journalCategories');
  const journalEntries = document.getElementById('journalEntries');
  const journalImage = document.getElementById('journalImage');
  const journalText = document.getElementById('journalText');
  const optionsOverlay = document.getElementById('optionsOverlay');
  const optionsAudioToggle = document.getElementById('optionsAudioToggle');
  const optionsVolumeSlider = document.getElementById('optionsVolumeSlider');
  const languageSelect = document.getElementById('languageSelect');
  const closeOptionsBtn = document.getElementById('closeOptionsBtn');
  const mapBtn = document.getElementById('mapBtn');
  const mapOverlay = document.getElementById('mapOverlay');
  const mapGrid = document.getElementById('mapGrid');
  const closeMapBtn = document.getElementById('closeMapBtn');
  const mapPreview = document.getElementById('mapPreview');
  const previewImage = document.getElementById('previewImage');
  const previewName = document.getElementById('previewName');
  const goHereBtn = document.getElementById('goHereBtn');

  let audioEnabled = true;
  let volumeLevel = 1.0;

  function showTransition() {
    if (transitionOverlay) {
      transitionOverlay.classList.remove('fade-out');
      transitionOverlay.style.display = 'block';
      transitionOverlay.style.opacity = '1';
    }
  }

  function hideTransition() {
    if (transitionOverlay) {
      transitionOverlay.classList.add('fade-out');
      transitionOverlay.addEventListener('transitionend', () => {
        transitionOverlay.style.display = 'none';
        transitionOverlay.classList.remove('fade-out');
      }, { once: true });
    }
  }

  let currentVerb = null;     // Verbo selezionato (e.g. "USA", "GUARDA")
  let useFirstTarget = null;  // Primo oggetto scelto quando currentVerb === 'USA'
  let selectedButton = null;  // Riferimento al pulsante verbo attualmente selezionato
  let selectedTargets = [];   // Array dei pulsanti target selezionati
  let isViewingItem = false;  // Stato se si sta visualizzando un oggetto
  let selectedQuestCategoryBtn = null;
  let selectedQuestBtn = null;
  let selectedJournalCategoryBtn = null;
  let selectedJournalEntryBtn = null;

  // Controlla se il gioco è pronto (ha gameData caricato)
  function isGameReady() {
    return typeof window.gameData !== 'undefined' && window.gameData !== null;
  }

  // Mostra messaggio di stato
  function showStatus(message, isError = false) {
    if (BoxTesto) {
      BoxTesto.textContent = message;
      BoxTesto.style.color = isError ? '#cc3333' : '#ffffff';
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
        window.GameState.setCurrentLocation(window.gameData.locationInfo.id);
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
      updateMapButtonState();
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
      const basePath = locationInfo.image;
      const trySources = [];

      if (/\.(png|jpg)$/i.test(basePath)) {
        trySources.push(basePath);
        trySources.push(basePath.endsWith('.png') ? basePath.replace(/\.png$/i, '.jpg') : basePath.replace(/\.jpg$/i, '.png'));
      } else {
        trySources.push(`${basePath}.png`, `${basePath}.jpg`);
      }

      let index = 0;
      const tryLoad = () => {
        if (index >= trySources.length) {
          console.warn(`⚠️ Immagine non trovata: ${basePath}`);
          sceneImage.style.display = 'none';
          if (defaultContent) {
            defaultContent.style.display = 'block';
            defaultContent.innerHTML = `
              <h2>🎮 ${locationInfo.name}</h2>
              <p>${locationInfo.description}</p>
              <p><small>Immagine: ${basePath} (non trovata)</small></p>
            `;
          }
          return;
        }

        const src = trySources[index++];
        sceneImage.onerror = tryLoad;
        sceneImage.onload = () => {
          console.log(`🖼️ Immagine caricata: ${src}`);
        };
        sceneImage.src = src;
        sceneImage.alt = locationInfo.name;
      };

      tryLoad();
    }
  }

  // Carica l'inventario 
  function loadInventory() {
    if (window.GameState) {
      // Usa solo il GameState - l'inventario è già stato caricato/inizializzato
      window.GameState.updateInventoryInterface();
    } else {
      // Fallback al sistema locale (se non c'è GameState)
      InventoryList.innerHTML = '';
      
      if (window.gameData && window.gameData.initialInventory) {
        window.gameData.initialInventory.forEach(item => {
          addToInventory(item);
        });
      }
    }
  }

  // Carica i punti di interesse
  function loadPointsOfInterest() {
    PoiList.innerHTML = ''; // Pulisce i POI esistenti
    
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
    PoiList.appendChild(button);
  }

  // Rimuove un punto di interesse
  function removePointOfInterest(poiName) {
    const buttons = PoiList.querySelectorAll('.left-button');
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
      const buttons = InventoryList.querySelectorAll('.inventory-button');
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
      InventoryList.appendChild(newButton);
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

  // Disabilita tutti i pulsanti tranne "X"
  function disableAllButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.disabled = true;
    });
    cancelButton.disabled = false;
  }

  // Riabilita tutti i pulsanti
  function enableAllButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.disabled = false;
    });
  }

  let previousImageSrc = '';

  // Mostra l'immagine di un oggetto in primo piano
  function showItemView(itemData) {
    if (!itemData || !itemData.image || !sceneImage) return;

    isViewingItem = true;
    previousImageSrc = sceneImage.src;
    sceneImage.src = itemData.image;
    sceneImage.style.aspectRatio = '1 / 1';
    sceneImage.style.objectFit = 'contain';
    ContenutoPrincipale.classList.add('item-view');

    disableAllButtons();
    cancelButton.classList.remove('hidden');

    if (itemData.description) {
      showStatus(itemData.description);
    }
  }

  function hideItemView() {
    if (!isViewingItem) return;

    isViewingItem = false;
    enableAllButtons();
    cancelButton.classList.add('hidden');
    sceneImage.style.aspectRatio = '';
    sceneImage.src = previousImageSrc || sceneImage.src;
    ContenutoPrincipale.classList.remove('item-view');
    resetVerbState();
    loadScene();
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

    // Gestione speciale per "FUORI" dalla cella
    if (buttonId === 'fuori' && window.GameState) {
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
      case 'vai':
        currentVerb = 'VAI';
        break;
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
      case 'apri':
        currentVerb = 'APRI';
        break;
      case 'chiudi':
        currentVerb = 'CHIUDI';
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
    if (isViewingItem) {
      hideItemView();
    } else {
      resetVerbState();
      const message = window.gameData?.systemMessages?.operationCancelled || "Operazione annullata.";
      showStatus(message);
    }
  });

  // Gestione click sui target (POI a sinistra o oggetti inventario a destra)
  async function onTargetClick(evt) {
    if (!currentVerb) return; // Se non c'è un verbo selezionato, ignora
    
    if (!isGameReady()) {
      showStatus("⚠️ Dati di gioco non disponibili per le interazioni", true);
      resetVerbState();
      return;
    }

    const targetText = evt.currentTarget.textContent.trim();
    const targetButton = evt.currentTarget;
    const isDirection = targetButton.parentElement && targetButton.parentElement.id === 'movementGroup';
    const targetKey = isDirection ? targetButton.id : targetText;
    
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

        if (typeof response === 'function') {
          response();
        } else {
          showStatus(response);
        }
        resetVerbState();
        return;
      }
    }

    // Se il verbo NON è "USA", evidenzia il target e gestisci combinazioni singole
    selectTarget(targetButton);

    if (currentVerb === 'VAI' && isDirection) {
      await onMovementClick(evt);
      resetVerbState();
      return;
    }

    // Se "GUARDA" un oggetto dell'inventario, mostra l'immagine ingrandita
    if (currentVerb === 'GUARDA' && typeof window.getItem === 'function') {
      const itemData = window.getItem(targetText);
      if (itemData) {
        if (targetButton.classList.contains('inventory-button')) {
          showItemView(itemData);
          return;
        } else if (itemData.description) {
          showStatus(itemData.description);
          resetVerbState();
          return;
        }
      }
    }

    // Cerca l'interazione nell'oggetto interactions
    const interactionKey = `${currentVerb}_${targetKey}`;
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
    
    if (typeof response === 'function') {
      response();
    } else {
      showStatus(response);
    }
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
          Modal.alert(escapeMessages.ESCAPE_DOOR);
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
          Modal.alert(escapeMessages.ESCAPE_WINDOW);
          if (window.LocationManager) {
            window.LocationManager.executeMovement('ESCAPE_WINDOW');
          } else {
            showVictoryScreen();
          }
        }, 1000);
        break;
        
      case 'ESCAPE_TUNNEL':
        setTimeout(() => {
          Modal.alert(escapeMessages.ESCAPE_TUNNEL);
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

  // ===== GESTIONE SCHERMATA DI DIALOGO =====
  function showDialogue(imageSrc, text, options) {
    if (!dialogueOverlay) return;
    if (dialogueImage) dialogueImage.src = imageSrc || '';
    if (dialogueText) dialogueText.textContent = text || '';
    if (dialogueOptions) {
      dialogueOptions.innerHTML = '';
      (options || []).slice(0, 8).forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'dialogue-option-button';
        const label = typeof opt === 'string' ? opt : opt.text;
        btn.textContent = label || '';
        if (typeof opt === 'object' && typeof opt.onSelect === 'function') {
          btn.addEventListener('click', () => {
            opt.onSelect();
            // Rimuovi la chiusura automatica per evitare lo "stacco" tra
            // una battuta e la successiva. Sarà il callback a decidere se
            // chiudere il dialogo.
          });
        }
        dialogueOptions.appendChild(btn);
      });
    }
    dialogueOverlay.style.display = 'flex';
  }

  function hideDialogue() {
    if (dialogueOverlay) dialogueOverlay.style.display = 'none';
  }

  // ====== QUESTS & JOURNAL UI ======
  function updateQuestOverlay() {
    if (!questCategories || !questList || !questDetails) return;
    questCategories.innerHTML = '';
    questList.innerHTML = '';
    questDetails.innerHTML = '';
    selectedQuestCategoryBtn = null;
    selectedQuestBtn = null;
    const categories = { main: 'MAIN QUEST', sides: 'SIDE QUEST' };
    Object.keys(categories).forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'inventory-button';
      btn.textContent = categories[cat];
      btn.addEventListener('click', () => {
        if (selectedQuestCategoryBtn) selectedQuestCategoryBtn.classList.remove('selected');
        selectedQuestCategoryBtn = btn;
        btn.classList.add('selected');
        loadQuestList(cat);
      });
      questCategories.appendChild(btn);
    });
  }

  function loadQuestList(cat) {
    questList.innerHTML = '';
    questDetails.innerHTML = '';
    selectedQuestBtn = null;
    const quests = cat === 'main' ? [window.Quests.main] : window.Quests.sides || [];
    quests.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'inventory-button';
      btn.textContent = q.name;
      btn.addEventListener('click', () => {
        if (selectedQuestBtn) selectedQuestBtn.classList.remove('selected');
        selectedQuestBtn = btn;
        btn.classList.add('selected');
        showQuestDetails(cat, q.id);
      });
      questList.appendChild(btn);
    });
  }

  function showQuestDetails(cat, questId) {
    questDetails.innerHTML = '';
    let quest = null;
    if (cat === 'main' && window.Quests.main.id === questId) {
      quest = window.Quests.main;
    } else if (cat === 'sides') {
      quest = (window.Quests.sides || []).find(q => q.id === questId);
    }
    if (!quest) return;
    const h = document.createElement('h3');
    h.textContent = quest.name;
    questDetails.appendChild(h);
    const ul = document.createElement('ul');
    quest.tasks.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t.description;
      li.className = t.completed ? 'quest-completed' : 'quest-pending';
      ul.appendChild(li);
    });
    questDetails.appendChild(ul);
  }

  // Rendi accessibili anche esternamente per il QuestManager
  window.updateQuestOverlay = updateQuestOverlay;
  window.loadQuestList = loadQuestList;
  window.showQuestDetails = showQuestDetails;

  function updateAchievementsOverlay() {
    if (!achievementsGrid) return;
    achievementsGrid.innerHTML = '';
    const ids = Object.keys(window.Achievements || {});
    const total = 50;
    for (let i = 0; i < total; i++) {
      const slot = document.createElement('div');
      slot.className = 'achievement-slot';
      const data = window.Achievements ? window.Achievements[ids[i]] : null;
      const unlocked = data && (!data.flag || window.GameState?.hasFlag(data.flag));
      if (unlocked) {
        if (data.image) {
          const img = document.createElement('img');
          img.src = data.image;
          slot.appendChild(img);
        }
        const d = document.createElement('div');
        d.textContent = data.description || '';
        slot.appendChild(d);
      }
      achievementsGrid.appendChild(slot);
    }
  }

  function updateJournalOverlay() {
    if (!journalCategories || !journalEntries) return;
    journalCategories.innerHTML = '';
    journalEntries.innerHTML = '';
    journalImage.innerHTML = '';
    journalText.textContent = '';
    selectedJournalCategoryBtn = null;
    selectedJournalEntryBtn = null;
    const cats = window.JournalData?.categories || {};
    Object.keys(cats).forEach(catId => {
      const btn = document.createElement('button');
      btn.className = 'inventory-button';
      btn.textContent = cats[catId];
      btn.addEventListener('click', () => {
        if (selectedJournalCategoryBtn) selectedJournalCategoryBtn.classList.remove('selected');
        selectedJournalCategoryBtn = btn;
        btn.classList.add('selected');
        loadJournalEntries(catId);
      });
      journalCategories.appendChild(btn);
    });
  }

  function loadJournalEntries(catId) {
    journalEntries.innerHTML = '';
    journalImage.innerHTML = '';
    journalText.textContent = '';
    selectedJournalEntryBtn = null;
    const entries = window.JournalData?.entries[catId] || {};
    Object.keys(entries).forEach(eid => {
      if (!window.GameState?.hasJournalFlag(eid)) return;
      const btn = document.createElement('button');
      btn.className = 'inventory-button';
      btn.textContent = entries[eid].name;
      btn.addEventListener('click', () => {
        if (selectedJournalEntryBtn) selectedJournalEntryBtn.classList.remove('selected');
        selectedJournalEntryBtn = btn;
        btn.classList.add('selected');
        showJournalEntry(catId, eid);
      });
      journalEntries.appendChild(btn);
    });
  }

  function showJournalEntry(catId, eid) {
    const entry = window.JournalData?.entries[catId]?.[eid];
    if (!entry) return;
    journalImage.innerHTML = entry.image ? `<img src="${entry.image}" alt="${entry.name}">` : '';
    journalText.textContent = entry.description || '';
  }

  function findLocationByCoord(coord) {
    const cfg = window.LocationManager?.locationConfig || {};
    for (const id in cfg) {
      if (cfg[id].coordinates === coord) return id;
    }
    return null;
  }

  function updateMapOverlay() {
    if (!mapGrid) return;
    mapGrid.innerHTML = '';
    if (previewImage) previewImage.style.display = 'none';
    if (goHereBtn) goHereBtn.style.display = 'none';
    if (previewName) previewName.textContent = '';
    const letters = 'ABCDEFGHIJKLMNOPQRST'.split('');
    for (let r = 0; r <= 20; r++) {
      for (let c = 0; c <= 20; c++) {
        const cell = document.createElement('div');
        if (r === 0 && c === 0) {
          cell.className = 'map-label';
        } else if (r === 0) {
          cell.className = 'map-label';
          cell.textContent = letters[c - 1];
        } else if (c === 0) {
          cell.className = 'map-label';
          cell.textContent = r;
        } else {
          const coord = letters[c - 1] + r;
          cell.className = 'map-cell';
          const locId = findLocationByCoord(coord);
          if (locId) {
            if (window.GameState?.location_visitate[locId]) {
              cell.classList.add('visited');
              const data = window.LocationManager?.locations[locId]?.locationInfo;
              if (data && data.image) {
                const img = document.createElement('img');
                img.src = data.image;
                cell.appendChild(img);
              }
              const name = document.createElement('span');
              name.textContent = data?.name || locId;
              cell.appendChild(name);
              cell.addEventListener('click', () => {
                const info = window.LocationManager?.locations[locId]?.locationInfo;
                if (info) {
                  if (previewImage) {
                    previewImage.src = info.image || '';
                    previewImage.style.display = info.image ? 'block' : 'none';
                  }
                  if (previewName) previewName.textContent = info.name || locId;
                  if (goHereBtn) {
                    goHereBtn.style.display = 'block';
                    goHereBtn.onclick = () => {
                      if (window.LocationManager) {
                        window.LocationManager.changeLocation(locId);
                        mapOverlay.style.display = 'none';
                      }
                    };
                  }
                }
              });
            } else {
              cell.textContent = '?';
            }
            if (locId === window.GameState?.currentLocation) {
              cell.classList.add('current');
            }
          } else {
            cell.textContent = '?';
          }
        }
        mapGrid.appendChild(cell);
      }
    }
  }

  function updateMapButtonState() {
    if (!mapBtn) return;
    mapBtn.disabled = !!window.GameState?.flags?.map_disabled;
  }

  // I pulsanti di movimento agiscono come target per i verbi
  movementButtons.forEach(btn => {
    btn.addEventListener('click', onTargetClick);
  });
  
  // Assegno i listener ai pulsanti di interazione (richiedono target)
  interactionButtons.forEach(btn => {
    btn.addEventListener('click', onVerbClick);
  });

  if (mainMenuButton) {
    mainMenuButton.addEventListener('click', () => {
      showTransition();
      setTimeout(() => { window.location.href = 'index.html'; }, 300);
    });
  }

  if (optionsMenuButton) {
    optionsMenuButton.addEventListener('click', () => {
      if (optionsOverlay) {
        optionsAudioToggle.checked = audioEnabled;
        optionsVolumeSlider.value = volumeSlider.value;
        languageSelect.value = LanguageManager.current;
        optionsOverlay.style.display = 'flex';
      }
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
  updateMapButtonState();

  if (closeOptionsBtn && optionsOverlay) {
    closeOptionsBtn.addEventListener('click', () => {
      audioEnabled = optionsAudioToggle.checked;
      volumeSlider.value = optionsVolumeSlider.value;
      updateAudioUI();
      LanguageManager.set(languageSelect.value);
      optionsOverlay.style.display = 'none';
    });
  }

  // Listener per schermate di quests e journal
  if (questsBtn && questsOverlay) {
    questsBtn.addEventListener('click', () => {
      updateQuestOverlay();
      questsOverlay.style.display = 'flex';
    });
  }

  const closeQuestsBtn = document.getElementById('closeQuestsBtn');
  const closeAchievementsBtn = document.getElementById('closeAchievementsBtn');
  if (closeQuestsBtn) {
    closeQuestsBtn.addEventListener('click', () => {
      questsOverlay.style.display = 'none';
    });
  }
  if (achievementsBtn) {
    achievementsBtn.addEventListener('click', () => {
      updateAchievementsOverlay();
      achievementsOverlay.style.display = 'flex';
    });
  }
  if (closeAchievementsBtn) {
    closeAchievementsBtn.addEventListener('click', () => {
      achievementsOverlay.style.display = 'none';
    });
  }
  if (journalBtn && journalOverlay) {
    journalBtn.addEventListener('click', () => {
      updateJournalOverlay();
      journalOverlay.style.display = 'flex';
    });
  }
  const closeJournalBtn = document.getElementById('closeJournalBtn');
  if (closeJournalBtn) {
    closeJournalBtn.addEventListener('click', () => {
      journalOverlay.style.display = 'none';
    });
  }

  if (mapBtn && mapOverlay) {
    mapBtn.addEventListener('click', () => {
      updateMapOverlay();
      if (previewImage) previewImage.style.display = 'none';
      if (goHereBtn) goHereBtn.style.display = 'none';
      if (previewName) previewName.textContent = '';
      mapOverlay.style.display = 'flex';
    });
  }
  if (closeMapBtn) {
    closeMapBtn.addEventListener('click', () => {
      mapOverlay.style.display = 'none';
    });
  }

  // Assegno i listener al popup di inventario (destra) e POI (sinistra)
  function updateInventoryListeners() {
    const currentInventoryButtons = Array.from(InventoryList.querySelectorAll('.inventory-button'));
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
        const startIntro = localStorage.getItem('startIntroCutscene');
        if (startIntro && window.CutsceneManager) {
          localStorage.removeItem('startIntroCutscene');
          await window.CutsceneManager.playCutscene('intro');
        } else {
          await window.LocationManager.initialize();
        }
        setTimeout(hideTransition, 100);
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
      setTimeout(hideTransition, 100);
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
      setTimeout(hideTransition, 100);
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
    showDialogue: showDialogue,
    hideDialogue: hideDialogue,
    resetVerbState: resetVerbState,
    applyEffect: applyEffect,
    isGameReady: isGameReady
  };

  // Rendi accessibili le funzioni di dialogo al gestore dei dialoghi
  window.showDialogue = showDialogue;
  window.hideDialogue = hideDialogue;

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
        const items = Array.from(document.querySelectorAll('#InventoryList .inventory-button'))
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