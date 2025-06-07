// ===== SISTEMA SEMPLICE DI STATO DEL GIOCO =====

const GameState = {
    // Inventario: semplice array di nomi oggetti
    inventory: [],
    
    // Flag: semplice oggetto con chiavi (presenza = true, assenza = non esiste)
    flags: {},

    // Flag dei dialoghi affrontati
    dialogueFlags: {},
    
    // Location corrente
    currentLocation: null,
    visitedLocations: [],

    // Informazioni sul salvataggio
    savedAt: null,
    locationName: null,
    saveName: '',

    // Slot di salvataggio corrente
    saveSlot: 'slot1',

    // Chiave di archiviazione basata sullo slot
    get storageKey() {
        return `adventureGameSave_${this.saveSlot}`;
    },
    
    // ===== INVENTARIO E FLAG INIZIALI DEL GIOCO =====
    gameInitialState: {
        // Inventario di partenza (impostato UNA VOLTA all'inizio)
        startingInventory: [],
        
        // Flag iniziali del gioco (se necessari)
        startingFlags: [
            // "tutorial_completato" // Esempio: se il gioco inizia con alcuni flag già attivi
        ],

        // Dialoghi affrontati di partenza
        startingDialogueFlags: []
    },
    
    // ===== METODI INVENTARIO =====
    addItem(itemName) {
        if (!this.inventory.includes(itemName)) {
            this.inventory.push(itemName);
            this.updateInventoryInterface();
            this.saveToStorage();
            console.log(`📦 Aggiunto: ${itemName}`);
        }
    },
    
    removeItem(itemName) {
        const index = this.inventory.indexOf(itemName);
        if (index !== -1) {
            this.inventory.splice(index, 1);
            this.updateInventoryInterface();
            this.saveToStorage();
            console.log(`📤 Rimosso: ${itemName}`);
            return true;
        }
        return false;
    },
    
    hasItem(itemName) {
        return this.inventory.includes(itemName);
    },
    
    // ===== METODI FLAG =====
    setFlag(flagName) {
        this.flags[flagName] = true;
        this.saveToStorage();
        console.log(`🚩 Flag impostato: ${flagName}`);
    },
    
    hasFlag(flagName) {
        return flagName in this.flags;
    },
    
    removeFlag(flagName) {
        delete this.flags[flagName];
        this.saveToStorage();
    },

    // ===== METODI FLAG DIALOGHI =====
    setDialogueFlag(dialogueId) {
        this.dialogueFlags[dialogueId] = true;
        this.saveToStorage();
        console.log(`💬 Dialogo segnato: ${dialogueId}`);
    },

    hasDialogueFlag(dialogueId) {
        return dialogueId in this.dialogueFlags;
    },

    removeDialogueFlag(dialogueId) {
        delete this.dialogueFlags[dialogueId];
        this.saveToStorage();
    },

    // ===== GESTIONE LOCATION =====
    setCurrentLocation(locationId) {
        this.currentLocation = locationId;
        if (!this.visitedLocations.includes(locationId)) {
            this.visitedLocations.push(locationId);
        }
        this.saveToStorage();
    },

    getDebugInfo() {
        return {
            inventory: [...this.inventory],
            flags: { ...this.flags },
            dialogueFlags: { ...this.dialogueFlags },
            currentLocation: this.currentLocation,
            visitedLocations: [...this.visitedLocations]
        };
    },

    setSaveSlot(slot) {
        this.saveSlot = slot;
        localStorage.setItem('currentSaveSlot', this.saveSlot);
    },
    
    // ===== AGGIORNA INTERFACCIA =====
    updateInventoryInterface() {
        const inventoryContainer = document.getElementById('InventoryList');
        if (!inventoryContainer) return;
        
        // Pulisce inventario
        inventoryContainer.innerHTML = '';

        // Aggiunge pulsanti per ogni oggetto con immagine e descrizione
        this.inventory.forEach(itemName => {
            const button = document.createElement('button');
            button.className = 'inventory-button';

            const itemData = typeof window.getItem === 'function' ? window.getItem(itemName) : null;

            if (itemData && itemData.image) {
                const img = document.createElement('img');
                img.src = itemData.image;
                img.alt = itemName;
                img.className = 'inventory-icon';
                button.appendChild(img);
            }

            const label = document.createElement('span');
            label.textContent = itemName;
            button.appendChild(label);

            if (itemData && itemData.description) {
                button.title = itemData.description;
            }

            button.addEventListener('click', window.gameInterface?.onInventoryClick || (() => {}));
            inventoryContainer.appendChild(button);
        });
    },
    
    // ===== SALVATAGGIO =====
    saveToStorage() {
        const saveData = {
            inventory: this.inventory,
            flags: this.flags,
            dialogueFlags: this.dialogueFlags,
            currentLocation: this.currentLocation,
            locationName: window.LocationManager?.locationConfig?.[this.currentLocation]?.name || this.locationName || this.currentLocation,
            savedAt: new Date().toISOString(),
            saveName: this.saveName
        };

        // Aggiorna proprietà locali
        this.savedAt = saveData.savedAt;
        this.locationName = saveData.locationName;
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
        } catch (error) {
            console.error("❌ Errore salvataggio:", error);
        }
    },
    
    loadFromStorage() {
        try {
            const saveData = localStorage.getItem(this.storageKey);
            if (saveData) {
                const data = JSON.parse(saveData);
                this.inventory = data.inventory || [];
                this.flags = data.flags || {};
                this.dialogueFlags = data.dialogueFlags || {};
                this.currentLocation = data.currentLocation || null;
                this.locationName = data.locationName || null;
                this.savedAt = data.savedAt || null;
                this.saveName = data.saveName || this.saveName;
                console.log("📂 Stato caricato dal salvataggio");
                return true;
            }
        } catch (error) {
            console.error("❌ Errore caricamento:", error);
        }
        return false;
    },
    
    // ===== INIZIALIZZAZIONE =====
    initialize(slot) {
        if (slot) {
            this.saveSlot = slot;
        } else {
            const storedSlot = localStorage.getItem('currentSaveSlot');
            this.saveSlot = storedSlot || this.saveSlot;
        }

        localStorage.setItem('currentSaveSlot', this.saveSlot);

        const loaded = this.loadFromStorage();

        const pendingName = localStorage.getItem('pendingSaveName');
        if (pendingName) {
            this.saveName = pendingName;
            localStorage.removeItem('pendingSaveName');
        }

        if (!loaded) {
            // Primo avvio: imposta stato iniziale
            console.log("🎮 Primo avvio - Impostazione stato iniziale");
            this.setupInitialGameState();
            this.saveToStorage();
        }
        
        console.log("🎮 GameState inizializzato");
        console.log("🎒 Inventario:", this.inventory);
        console.log("🚩 Flag:", Object.keys(this.flags));
        console.log("💬 Dialoghi affrontati:", Object.keys(this.dialogueFlags));
    },
    
    // Imposta stato iniziale del gioco (solo al primo avvio)
    setupInitialGameState() {
        // Se l'inventario di partenza è vuoto, popola con 20 oggetti casuali
        if (this.gameInitialState.startingInventory.length === 0 &&
            typeof window.getAllItemNames === 'function') {
            const names = window.getAllItemNames();
            const numberToAdd = Math.min(20, names.length);
            while (this.gameInitialState.startingInventory.length < numberToAdd) {
                const randomName = names[Math.floor(Math.random() * names.length)];
                if (!this.gameInitialState.startingInventory.includes(randomName)) {
                    this.gameInitialState.startingInventory.push(randomName);
                }
            }
        }

        // Imposta inventario iniziale
        this.gameInitialState.startingInventory.forEach(item => {
            this.addItem(item);
        });
        
        // Imposta flag iniziali
        this.gameInitialState.startingFlags.forEach(flag => {
            this.setFlag(flag);
        });

        // Imposta flag dialoghi iniziali
        this.gameInitialState.startingDialogueFlags.forEach(dialogueFlag => {
            this.setDialogueFlag(dialogueFlag);
        });
        
        console.log("✨ Stato iniziale del gioco impostato");
    },
    
    // ===== RESET =====
    reset() {
        this.inventory = [];
        this.flags = {};
        this.dialogueFlags = {};
        this.currentLocation = null;
        localStorage.removeItem(this.storageKey);
        this.updateInventoryInterface();
        
        // Riapplica stato iniziale
        this.setupInitialGameState();
        
        console.log("🔄 GameState resettato e stato iniziale ripristinato");
    }
};

// Auto-inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    GameState.initialize();
});

// Esposizione globale
window.GameState = GameState;

// Comandi debug semplici
window.gameStateDebug = {
    showInventory: () => console.log("🎒 Inventario:", GameState.inventory),
    showFlags: () => console.log("🚩 Flag:", Object.keys(GameState.flags)),
    showDialogueFlags: () => console.log("💬 Dialoghi:", Object.keys(GameState.dialogueFlags)),
    addItem: (name) => GameState.addItem(name),
    removeItem: (name) => GameState.removeItem(name),
    setFlag: (name) => GameState.setFlag(name),
    hasFlag: (name) => console.log(`Flag ${name}:`, GameState.hasFlag(name)),
    reset: () => GameState.reset(),
    showVisited: () => console.log("👣 Visitato:", GameState.visitedLocations),
    setLocation: (loc) => GameState.setCurrentLocation(loc),
    debugInfo: () => console.log(GameState.getDebugInfo())
};