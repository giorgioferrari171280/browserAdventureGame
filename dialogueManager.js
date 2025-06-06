// ===== SEMPLICE SISTEMA DI DIALOGHI =====
const DialogueManager = {
    dialogues: {},
    dialogueConfig: {
        'droide_xc1230': { file: 'dialogues/droide_xc1230.js' }
    },

    async loadDialogue(id) {
        if (this.dialogues[id]) {
            return this.dialogues[id];
        }
        const cfg = this.dialogueConfig[id];
        if (!cfg) throw new Error(`Dialogo non trovato: ${id}`);
        await this.loadScript(cfg.file);
        if (!window.currentDialogueData) {
            throw new Error(`Il file ${cfg.file} non ha impostato currentDialogueData`);
        }
        this.dialogues[id] = { ...window.currentDialogueData, id };
        window.currentDialogueData = null;
        return this.dialogues[id];
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

    async playDialogue(id) {
        const data = await this.loadDialogue(id);
        if (!window.showDialogue) return;
        const options = (data.options || []).map(opt => ({
            text: opt.text,
            onSelect: () => {
                setTimeout(() => {
                    window.showDialogue(data.image || '', opt.response, [
                        { text: 'Chiudi', onSelect: () => {} }
                    ]);
                }, 0);
            }
        }));
        window.showDialogue(data.image || '', data.text, options);
    }
};

window.DialogueManager = DialogueManager;
