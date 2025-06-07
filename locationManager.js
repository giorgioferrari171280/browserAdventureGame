// ===== SISTEMA PER GESTIRE MULTIPLE LOCATION =====

const LocationManager = {
    currentLocationId: null,
    locations: {}, // Cache delle location caricate
    gameState: {
        globalInventory: [], // Inventario che persiste tra location
        globalFlags: {},     // Flag globali che persistono
        visitedLocations: [] // Traccia location visitate
    },
    
    // Configurazione delle location disponibili
    locationConfig: {
        "cella_prigioniero": {
            file: "locations/cella_prigioniero.js",
            name: "Cella del Prigioniero",
            connections: {
                "ESCAPE_DOOR": "corridoio_castello",
                "ESCAPE_TUNNEL": "giardino_segreto",
                "ESCAPE_WINDOW": "cortile_esterno"
            }
        },
        "corridoio_castello": {
            file: "locations/corridoio_castello.js", 
            name: "Corridoio del Castello",
            connections: {
                "vaiSud": "cella_prigioniero",
                "vaiNord": "biblioteca_antica",
                "vaiEst": "sala_guardie",
                "vaiOvest": "cucine_castello"
            }
        },
        "biblioteca_antica": {
            file: "locations/biblioteca_antica.js",
            name: "Biblioteca Antica", 
            connections: {
                "vaiSud": "corridoio_castello",
                "sali": "torre_osservazione",
                "DOOR_LIBRARIAN": "studio_bibliotecario"
            }
        },
        "giardino_segreto": {
            file: "locations/giardino_segreto.js",
            name: "Giardino Segreto",
            connections: {
                "entra": "cella_prigioniero",
                "vaiNord": "bosco_incantato",
                "GATE_GARDEN": "borgo_vicino"
            }
        }
    },

    // Carica una location dinamicamente
    async loadLocation(locationId) {
        console.log(`🗺️ Caricando location: ${locationId}`);
        
        // Se è già in cache, usala
        if (this.locations[locationId]) {
            console.log(`✅ Location trovata in cache`);
            return this.locations[locationId];
        }
        
        // Altrimenti carica dal file
        const config = this.locationConfig[locationId];
        if (!config) {
            throw new Error(`Location non trovata: ${locationId}`);
        }
        
        try {
            // Carica dinamicamente il file JavaScript
            await this.loadScript(config.file);
            
            // Il file dovrebbe aver impostato window.currentLocationData
            if (!window.currentLocationData) {
                throw new Error(`Il file ${config.file} non ha impostato currentLocationData`);
            }
            
            // Salva in cache
            this.locations[locationId] = {
                ...window.currentLocationData,
                id: locationId,
                config: config
            };
            
            console.log(`✅ Location ${locationId} caricata con successo`);
            return this.locations[locationId];
            
        } catch (error) {
            console.error(`❌ Errore nel caricamento di ${locationId}:`, error);
            throw error;
        }
    },
    
    // Carica un file JavaScript dinamicamente
    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Rimuovi script precedente se esiste
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                existingScript.remove();
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },
    
    // Cambia location attuale
    async changeLocation(locationId) {
        try {
            console.log(`🚀 Cambiando a location: ${locationId}`);
            
            // Salva lo stato della location corrente
            if (this.currentLocationId) {
                this.saveCurrentLocationState();
            }
            
            // Carica la nuova location
            const locationData = await this.loadLocation(locationId);
            
            // Aggiorna lo stato globale
            this.currentLocationId = locationId;
            if (!this.gameState.visitedLocations.includes(locationId)) {
                this.gameState.visitedLocations.push(locationId);
            }
            
            // Imposta i dati per il gioco
            window.gameData = this.mergeLocationWithGlobalState(locationData);
            
            // Reinizializza l'interfaccia
            if (window.gameInterface && window.gameInterface.initializeGame) {
                window.gameInterface.initializeGame();
            }
            
            console.log(`✅ Location cambiata a: ${locationData.locationInfo.name}`);
            
        } catch (error) {
            console.error(`❌ Errore nel cambio location:`, error);
            Modal.alert(`Errore nel caricamento della location: ${error.message}`);
        }
    },
    
    // Merge dei dati location con stato globale
    mergeLocationWithGlobalState(locationData) {
        let mergedInventory = [...locationData.initialInventory];
        let mergedFlags = { ...locationData.flags };
        
        // Se GameState è disponibile, usa quello per stato persistente
        if (window.GameState) {
            // L'inventario viene gestito completamente da GameState
            mergedInventory = []; // GameState gestirà tutto
            
            // Merge flag: location + globali dal GameState
            Object.keys(window.GameState.flags).forEach(flagName => {
                mergedFlags[flagName] = window.GameState.flags[flagName];
            });
        } else {
            // Fallback al sistema precedente
            mergedInventory = [
                ...locationData.initialInventory,
                ...this.gameState.globalInventory
            ];
            
            mergedFlags = {
                ...locationData.flags,
                ...this.gameState.globalFlags
            };
        }
        
        return {
            ...locationData,
            initialInventory: mergedInventory,
            flags: mergedFlags,
            // Aggiungi metodi per navigazione
            systemMessages: {
                ...locationData.systemMessages,
                locationChanged: "Sei arrivato in una nuova area.",
                cannotGoThere: "Non puoi andare in quella direzione da qui."
            }
        };
    },
    
    // Salva lo stato della location corrente
    saveCurrentLocationState() {
        if (!this.currentLocationId) return;
        
        if (window.GameState) {
            // Il GameState gestisce automaticamente il salvataggio
            // Aggiorna solo la location corrente
            window.GameState.setCurrentLocation(this.currentLocationId);
            return;
        }
        
        // Fallback al sistema precedente se GameState non è disponibile
        if (!window.gameData) return;
        
        // Salva nell'inventario globale tutti gli oggetti nuovi
        const currentInventory = this.getCurrentInventoryItems();
        const originalInventory = this.locations[this.currentLocationId].initialInventory;
        
        const newItems = currentInventory.filter(item => 
            !originalInventory.includes(item) && 
            !this.gameState.globalInventory.includes(item)
        );
        
        this.gameState.globalInventory.push(...newItems);
        
        // Salva flag importanti nell'stato globale
        Object.keys(window.gameData.flags).forEach(flag => {
            if (window.gameData.flags[flag] === true) {
                this.gameState.globalFlags[flag] = true;
            }
        });
        
        console.log(`💾 Stato salvato per ${this.currentLocationId}`);
    },
    
    // Ottiene gli oggetti attualmente nell'inventario
    getCurrentInventoryItems() {
        const inventoryButtons = document.querySelectorAll('#MenuDestro .inventory-button');
        return Array.from(inventoryButtons).map(btn => btn.textContent.trim());
    },
    
    // Controlla se il movimento è valido
    canMoveTo(direction) {
        const currentLocation = this.locations[this.currentLocationId];
        if (!currentLocation) return false;
        
        return currentLocation.config.connections.hasOwnProperty(direction);
    },
    
    // Esegue un movimento
    async executeMovement(direction) {
        if (!this.canMoveTo(direction)) {
            return false; // Movimento non valido
        }
        
        const currentLocation = this.locations[this.currentLocationId];
        const targetLocationId = currentLocation.config.connections[direction];
        
        await this.changeLocation(targetLocationId);
        return true; // Movimento eseguito
    },
    
    // Inizializza il sistema
    async initialize(startingLocationId = "cella_prigioniero") {
        console.log(`🎮 Inizializzando LocationManager con: ${startingLocationId}`);
        
        // Verifica se GameState è disponibile e inizializzato
        if (window.GameState) {
            console.log(`🔗 Integrazione con GameState attivata`);
            
            // Se GameState ha una location corrente salvata, usala
            if (window.GameState.currentLocation) {
                startingLocationId = window.GameState.currentLocation;
                console.log(`📍 Ripristino location salvata: ${startingLocationId}`);
            }
        }
        
        try {
            await this.changeLocation(startingLocationId);
            console.log(`✅ LocationManager inizializzato`);
        } catch (error) {
            console.error(`❌ Errore nell'inizializzazione:`, error);
        }
    },
    
    // Debug: mostra stato attuale
    debugState() {
        console.log("=== STATO LOCATION MANAGER ===");
        console.log("📍 Location corrente:", this.currentLocationId);
        console.log("🗃️ Location in cache:", Object.keys(this.locations));
        
        if (window.GameState) {
            console.log("🔗 INTEGRAZIONE GAMESTATE ATTIVA:");
            console.log("📊 Stato GameState:", window.GameState.getDebugInfo());
            console.log("🎒 Inventario:", window.GameState.inventory);
            console.log("🚩 Flag attivi:", Object.keys(window.GameState.flags));
            console.log("👣 Location visitate:", window.GameState.visitedLocations);
        } else {
            console.log("⚠️ GameState non disponibile - usando sistema locale:");
            console.log("🎒 Inventario globale:", this.gameState.globalInventory);
            console.log("🚩 Flag globali:", this.gameState.globalFlags);
            console.log("👣 Location visitate:", this.gameState.visitedLocations);
        }
    },
    
    // Ottiene lista di location raggiungibili
    getAvailableMovements() {
        const currentLocation = this.locations[this.currentLocationId];
        if (!currentLocation) return [];
        
        return Object.keys(currentLocation.config.connections).map(direction => ({
            direction: direction,
            targetId: currentLocation.config.connections[direction],
            targetName: this.locationConfig[currentLocation.config.connections[direction]]?.name || "Sconosciuto"
        }));
    }
};

// Esponi globalmente
window.LocationManager = LocationManager;