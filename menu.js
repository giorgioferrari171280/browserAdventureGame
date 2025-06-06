(function() {
    const mainMenu = document.getElementById('mainMenu');
    const loadScreen = document.getElementById('loadScreen');
    const slotGrid = document.getElementById('slotGrid');

    const newGameBtn = document.getElementById('newGameBtn');
    const loadGameBtn = document.getElementById('loadGameBtn');
    const backBtn = document.getElementById('backBtn');

    const locationNames = {
        'cella_prigioniero': 'Cella del Prigioniero',
        'corridoio_castello': 'Corridoio del Castello',
        'biblioteca_antica': 'Biblioteca Antica',
        'giardino_segreto': 'Giardino Segreto'
    };

    const slots = Array.from({length: 9}, (_, i) => `slot${i + 1}`);

    function startNewGame() {
        const slot = 'slot1';
        localStorage.setItem('currentSaveSlot', slot);
        localStorage.removeItem(`adventureGameSave_${slot}`);
        window.location.href = 'game.html';
    }

    function showMainMenu() {
        loadScreen.style.display = 'none';
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
            let summary = 'Vuoto';
            if (saveData) {
                try {
                    const data = JSON.parse(saveData);
                    const locName = locationNames[data.currentLocation] || data.currentLocation || 'Sconosciuto';
                    summary = `Posizione: ${locName}`;
                } catch (e) {
                    summary = 'Dati non validi';
                }
            }

            const info = document.createElement('div');
            info.textContent = summary;
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
        loadScreen.style.display = 'flex';
    }

    newGameBtn.addEventListener('click', startNewGame);
    loadGameBtn.addEventListener('click', showLoadScreen);
    backBtn.addEventListener('click', showMainMenu);
})();
