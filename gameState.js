// ===== SISTEMA SEMPLICE DI STATO DEL GIOCO =====

const GameState = {
    // Inventario: semplice array di nomi oggetti
    inventory: [],
    
    // Flag: semplice oggetto con chiavi (presenza = true, assenza = non esiste)
    flags: {},
    
    // Location corrente
    currentLocation: null,
    
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
            currentLocation: this.currentLocation
        };
        
        try {
            localStorage.setItem('adventureGameSave', JSON.stringify(saveData));
        } catch (error) {
            console.error("❌ Errore salvataggio:", error);
        }
    },
    
    loadFromStorage() {
        try {
            const saveData = localStorage.getItem('adventureGameSave');
            if (saveData) {
                const data = JSON.parse(saveData);
                this.inventory = data.inventory || [];
                this.flags = data.flags || {};
                this.currentLocation = data.currentLocation || null;
                console.log("📂 Stato caricato dal salvataggio");
                return true;
            }
        } catch (error) {
            console.error("❌ Errore caricamento:", error);
        }
        return false;
    },
    
    // ===== INIZIALIZZAZIONE =====
    initialize() {
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
        localStorage.removeItem('adventureGameSave');
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
    reset: () => GameState.reset()
};