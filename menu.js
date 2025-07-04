(function() {
    const mainMenu = document.getElementById('mainMenu');
    const loadScreen = document.getElementById('loadScreen');
    const slotGrid = document.getElementById('slotGrid');
    const newGameScreen = document.getElementById('newGameScreen');
    const newSlotGrid = document.getElementById('newSlotGrid');
    const saveNameInput = document.getElementById('saveNameInput');
    const createGameBtn = document.getElementById('createGameBtn');
    const cancelNewGameBtn = document.getElementById('cancelNewGameBtn');
    const transitionOverlay = document.getElementById('transitionOverlay');

    const newGameBtn = document.getElementById('newGameBtn');
    const loadGameBtn = document.getElementById('loadGameBtn');
    const backBtn = document.getElementById('backBtn');
    const quitBtn = document.getElementById('quitBtn');
    const optionsBtn = document.getElementById('optionsBtn');
    const optionsOverlay = document.getElementById('optionsOverlay');
    const optionsAudioToggle = document.getElementById('optionsAudioToggle');
    const optionsVolumeSlider = document.getElementById('optionsVolumeSlider');
    const languageSelect = document.getElementById('languageSelect');
    const closeOptionsBtn = document.getElementById('closeOptionsBtn');

    let audioEnabled = true;

    const menuMusic = document.getElementById('menuMusic');
    if (menuMusic) {
        menuMusic.volume = 0.1;
        menuMusic.loop = true;
        menuMusic.play().catch(() => {});
    }

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

            const selectBtn = document.createElement('button');
            selectBtn.textContent = 'Seleziona';
            selectBtn.className = 'inventory-button';
            selectBtn.addEventListener('click', () => {
                selectedSlot = slot;
                Array.from(newSlotGrid.children).forEach(c => c.classList.remove('selected-slot'));
                wrapper.classList.add('selected-slot');
            });
            wrapper.appendChild(selectBtn);

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
            Modal.alert('Seleziona uno slot e inserisci un nome per il salvataggio.');
            return;
        }

        const key = `adventureGameSave_${selectedSlot}`;
        if (localStorage.getItem(key)) {
            Modal.confirm('Lo slot è già occupato. Sovrascrivere?').then(overwrite => {
                if (!overwrite) return;
                proceed();
            });
        } else {
            proceed();
        }
        function proceed() {
            localStorage.setItem('currentSaveSlot', selectedSlot);
            localStorage.setItem('pendingSaveName', name);
            localStorage.setItem('startIntroCutscene', 'true');
            localStorage.removeItem(key);
            if (transitionOverlay) {
                transitionOverlay.classList.remove('fade-out');
                transitionOverlay.style.display = 'block';
            }
            setTimeout(() => { window.location.href = 'game.html'; }, 600);
        }
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

            const actions = document.createElement('div');
            actions.className = 'slot-actions';

            const loadBtn = document.createElement('button');
            loadBtn.textContent = 'Carica';
            loadBtn.className = 'inventory-button load-button';
            loadBtn.disabled = !saveData;
            loadBtn.addEventListener('click', () => {
                localStorage.setItem('currentSaveSlot', slot);
                if (transitionOverlay) {
                    transitionOverlay.classList.remove('fade-out');
                    transitionOverlay.style.display = 'block';
                }
                setTimeout(() => { window.location.href = 'game.html'; }, 600);
            });
            actions.appendChild(loadBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = '🗑️';
            deleteBtn.className = 'inventory-button delete-button';
            deleteBtn.disabled = !saveData;
            deleteBtn.addEventListener('click', () => {
                if (!saveData) return;
                Modal.confirm('Cancellare questo salvataggio?').then(confirmDel => {
                    if (confirmDel) {
                        localStorage.removeItem(key);
                        showLoadScreen();
                    }
                });
            });
            actions.appendChild(deleteBtn);

            wrapper.appendChild(actions);

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

    if (optionsBtn) {
        optionsBtn.addEventListener('click', () => {
            if (optionsOverlay) {
                optionsAudioToggle.checked = audioEnabled;
                optionsVolumeSlider.value = menuMusic ? menuMusic.volume * 100 : 100;
                languageSelect.value = LanguageManager.current;
                optionsOverlay.style.display = 'flex';
            }
        });
    }

    if (closeOptionsBtn && optionsOverlay) {
        closeOptionsBtn.addEventListener('click', () => {
            audioEnabled = optionsAudioToggle.checked;
            if (menuMusic) {
                menuMusic.volume = (audioEnabled ? optionsVolumeSlider.value : 0) / 100;
            }
            LanguageManager.set(languageSelect.value);
            optionsOverlay.style.display = 'none';
        });
    }
})();
