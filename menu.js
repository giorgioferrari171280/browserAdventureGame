(function() {
    const mainMenu = document.getElementById('mainMenu');
    const loadScreen = document.getElementById('loadScreen');
    const slotGrid = document.getElementById('slotGrid');
    const newGameScreen = document.getElementById('newGameScreen');
    const newSlotGrid = document.getElementById('newSlotGrid');
    const saveNameInput = document.getElementById('saveNameInput');
    const createGameBtn = document.getElementById('createGameBtn');
    const cancelNewGameBtn = document.getElementById('cancelNewGameBtn');

    const newGameBtn = document.getElementById('newGameBtn');
    const loadGameBtn = document.getElementById('loadGameBtn');
    const backBtn = document.getElementById('backBtn');
    const quitBtn = document.getElementById('quitBtn');

    const locationNames = {
        'cella_prigioniero': 'Cella del Prigioniero',
        'corridoio_castello': 'Corridoio del Castello',
        'biblioteca_antica': 'Biblioteca Antica',
        'giardino_segreto': 'Giardino Segreto'
    };

    const slots = Array.from({length: 9}, (_, i) => `slot${i + 1}`);
    let selectedSlot = null;

    function showNewGameScreen() {
        newSlotGrid.innerHTML = '';
        saveNameInput.value = '';
        selectedSlot = null;
        slots.forEach((slot, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'slot-entry';

            const label = document.createElement('div');
            label.textContent = `Slot ${index + 1}`;
            wrapper.appendChild(label);

            const key = `adventureGameSave_${slot}`;
            const saveData = localStorage.getItem(key);
            if (saveData) {
                wrapper.classList.add('occupied');
            }

            const info = document.createElement('div');
            info.textContent = saveData ? 'Occupato' : 'Vuoto';
            wrapper.appendChild(info);

            wrapper.addEventListener('click', () => {
                selectedSlot = slot;
                Array.from(newSlotGrid.children).forEach(c => c.classList.remove('selected-slot'));
                wrapper.classList.add('selected-slot');
            });

            newSlotGrid.appendChild(wrapper);
        });

        mainMenu.style.display = 'none';
        newGameScreen.style.display = 'flex';
    }

    function startNewGame() {
        const name = saveNameInput.value.trim();
        if (!selectedSlot || !name) {
            alert('Seleziona uno slot e inserisci un nome per il salvataggio.');
            return;
        }

        const key = `adventureGameSave_${selectedSlot}`;
        if (localStorage.getItem(key)) {
            const overwrite = confirm('Lo slot è già occupato. Sovrascrivere?');
            if (!overwrite) return;
        }

        localStorage.setItem('currentSaveSlot', selectedSlot);
        localStorage.setItem('pendingSaveName', name);
        localStorage.setItem('startIntroCutscene', 'true');
        localStorage.removeItem(key);
        window.location.href = 'game.html';
    }

    function showMainMenu() {
        loadScreen.style.display = 'none';
        newGameScreen.style.display = 'none';
        mainMenu.style.display = 'flex';
    }

    function showLoadScreen() {
        slotGrid.innerHTML = '';
        slots.forEach((slot, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'slot-entry';

            const label = document.createElement('div');
            label.textContent = `Slot ${index + 1}`;
            wrapper.appendChild(label);

            const key = `adventureGameSave_${slot}`;
            const saveData = localStorage.getItem(key);
            if (saveData) {
                wrapper.classList.add('occupied');
            }
            let summary = 'Vuoto';
            if (saveData) {
                try {
                    const data = JSON.parse(saveData);
                    const name = data.saveName || `Slot ${index + 1}`;
                    const locName = data.locationName || locationNames[data.currentLocation] || data.currentLocation || 'Sconosciuto';
                    const time = data.savedAt ? new Date(data.savedAt).toLocaleString() : '';
                    summary = `${name}\nPosizione: ${locName}` + (time ? `\n${time}` : '');
                } catch (e) {
                    summary = 'Dati non validi';
                }
            }

            const info = document.createElement('div');
            info.innerText = summary;
            wrapper.appendChild(info);

            const loadBtn = document.createElement('button');
            loadBtn.textContent = 'Carica';
            loadBtn.className = 'inventory-button';
            loadBtn.disabled = !saveData;
            loadBtn.addEventListener('click', () => {
                localStorage.setItem('currentSaveSlot', slot);
                window.location.href = 'game.html';
            });
            wrapper.appendChild(loadBtn);

            slotGrid.appendChild(wrapper);
        });

        mainMenu.style.display = 'none';
        newGameScreen.style.display = 'none';
        loadScreen.style.display = 'flex';
    }

    newGameBtn.addEventListener('click', showNewGameScreen);
    createGameBtn.addEventListener('click', startNewGame);
    cancelNewGameBtn.addEventListener('click', showMainMenu);
    loadGameBtn.addEventListener('click', showLoadScreen);
    backBtn.addEventListener('click', showMainMenu);
    quitBtn.addEventListener('click', () => {
        window.location.href = 'https://www.google.com';
    });
})();
