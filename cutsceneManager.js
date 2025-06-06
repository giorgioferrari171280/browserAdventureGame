// Sistema di gestione cutscene semplice
const CutsceneManager = {
    currentCutsceneId: null,
    cutscenes: {},

    // Configurazione delle cutscene disponibili
    cutsceneConfig: {
        'intro': { file: 'cutscenes/intro.js' }
    },

    async loadCutscene(id) {
        if (this.cutscenes[id]) {
            return this.cutscenes[id];
        }
        const config = this.cutsceneConfig[id];
        if (!config) throw new Error(`Cutscene non trovata: ${id}`);
        await this.loadScript(config.file);
        if (!window.currentCutsceneData) throw new Error(`Il file ${config.file} non ha impostato currentCutsceneData`);
        this.cutscenes[id] = { ...window.currentCutsceneData, id };
        window.currentCutsceneData = null;
        return this.cutscenes[id];
    },

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) existing.remove();
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    async playCutscene(id) {
        const data = await this.loadCutscene(id);
        this.currentCutsceneId = id;
        if (window.showCutscene) {
            window.showCutscene(data);
        }
    }
};

function showCutscene(data) {
    const overlay = document.getElementById('cutsceneOverlay');
    const img = document.getElementById('cutsceneImage');
    const textElem = document.getElementById('cutsceneText');
    const btn = document.getElementById('cutsceneContinueBtn');
    if (!overlay || !btn) return;
    if (img) {
        img.src = data.image || '';
    }
    if (textElem) {
        textElem.textContent = data.text || '';
    }
    overlay.style.display = 'flex';
    btn.onclick = async () => {
        overlay.style.display = 'none';
        if (data.nextLocation && window.LocationManager) {
            await window.LocationManager.changeLocation(data.nextLocation);
        }
    };
}


window.CutsceneManager = CutsceneManager;
window.showCutscene = showCutscene;
