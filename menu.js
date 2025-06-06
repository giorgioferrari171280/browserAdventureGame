(function() {
    const slotContainer = document.getElementById('slotContainer');
    const slots = ['slot1', 'slot2', 'slot3'];

    function createSlotEntry(slot, index) {
        const wrapper = document.createElement('div');
        wrapper.className = 'slot-entry';
        const label = document.createElement('span');
        label.textContent = `Slot ${index + 1}`;
        wrapper.appendChild(label);

        const key = `adventureGameSave_${slot}`;
        const hasSave = !!localStorage.getItem(key);

        const loadBtn = document.createElement('button');
        loadBtn.textContent = 'Carica';
        loadBtn.disabled = !hasSave;
        loadBtn.addEventListener('click', () => {
            localStorage.setItem('currentSaveSlot', slot);
            window.location.href = 'game.html';
        });
        wrapper.appendChild(loadBtn);

        const newBtn = document.createElement('button');
        newBtn.textContent = 'Nuova Partita';
        newBtn.addEventListener('click', () => {
            localStorage.setItem('currentSaveSlot', slot);
            localStorage.removeItem(key);
            window.location.href = 'game.html';
        });
        wrapper.appendChild(newBtn);

        slotContainer.appendChild(wrapper);
    }

    slots.forEach((slot, idx) => createSlotEntry(slot, idx));
})();
