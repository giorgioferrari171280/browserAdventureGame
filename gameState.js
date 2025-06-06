// ===== SISTEMA SEMPLICE DI STATO DEL GIOCO =====

const GameState = {
    // Inventario: semplice array di nomi oggetti
    inventory: [],
    
    // Flag: semplice oggetto con chiavi (presenza = true, assenza = non esiste)
    flags: {},
    
    // Location corrente
    currentLocation: null,
    visitedLocations: [],

    // Informazioni sul salvataggio
    savedAt: null,
    locationName: null,

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
        ]
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
        const inventoryContainer = document.getElementById('MenuDestro');
        if (!inventoryContainer) return;
        
        // Pulisce inventario
        inventoryContainer.innerHTML = '';
        
        // Aggiunge pulsanti per ogni oggetto
        this.inventory.forEach(itemName => {
            const button = document.createElement('button');
            button.className = 'inventory-button';
            button.textContent = itemName;
            button.addEventListener('click', window.gameInterface?.onInventoryClick || (() => {}));
            inventoryContainer.appendChild(button);
        });
    },
    
    // ===== SALVATAGGIO =====
    saveToStorage() {
        const saveData = {
            inventory: this.inventory,
            flags: this.flags,
            currentLocation: this.currentLocation,
            locationName: window.LocationManager?.locationConfig?.[this.currentLocation]?.name || this.locationName || this.currentLocation,
            savedAt: new Date().toISOString()
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
                this.currentLocation = data.currentLocation || null;
                this.locationName = data.locationName || null;
                this.savedAt = data.savedAt || null;
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
        
        if (!loaded) {
            // Primo avvio: imposta stato iniziale
            console.log("🎮 Primo avvio - Impostazione stato iniziale");
            this.setupInitialGameState();
        }
        
        console.log("🎮 GameState inizializzato");
        console.log("🎒 Inventario:", this.inventory);
        console.log("🚩 Flag:", Object.keys(this.flags));
    },
    
    // Imposta stato iniziale del gioco (solo al primo avvio)
    setupInitialGameState() {
        // Imposta inventario iniziale
        this.gameInitialState.startingInventory.forEach(item => {
            this.addItem(item);
        });
        
        // Imposta flag iniziali  
        this.gameInitialState.startingFlags.forEach(flag => {
            this.setFlag(flag);
        });
        
        console.log("✨ Stato iniziale del gioco impostato");
    },
    
    // ===== RESET =====
    reset() {
        this.inventory = [];
        this.flags = {};
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
    addItem: (name) => GameState.addItem(name),
    removeItem: (name) => GameState.removeItem(name),
    setFlag: (name) => GameState.setFlag(name),
    hasFlag: (name) => console.log(`Flag ${name}:`, GameState.hasFlag(name)),
    reset: () => GameState.reset(),
    showVisited: () => console.log("👣 Visitato:", GameState.visitedLocations),
    setLocation: (loc) => GameState.setCurrentLocation(loc),
    debugInfo: () => console.log(GameState.getDebugInfo())
};