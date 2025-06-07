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
            script.onerror = (e) => {
                console.error(`Errore caricamento script ${src}`, e);
                reject(new Error(`Impossibile caricare ${src}`));
            };
            document.head.appendChild(script);
        });
    },

    async playDialogue(id) {
        try {
            const data = await this.loadDialogue(id);
            if (!window.showDialogue) return;
            if (window.GameState && data.flag) {
                window.GameState.setDialogueFlag(data.flag);
            }
            const optionStates = (data.options || []).map(opt => {
                if (opt.sequence) {
                    return { sequence: opt.sequence, index: 0 };
                }
                return { sequence: [{ text: opt.text, response: opt.response }], index: 0 };
            });

            function buildOptions() {
                return optionStates.map((state, idx) => {
                    const current = state.sequence[state.index];
                    return {
                        text: current.text,
                        onSelect: () => {
                            const pair = state.sequence[state.index];
                            if (state.index < state.sequence.length - 1) {
                                state.index += 1;
                            }
                            setTimeout(() => {
                                window.showDialogue(
                                    data.image || '',
                                    pair.response,
                                    buildOptionsWithClose()
                                );
                            }, 0);
                        }
                    };
                });
            }

            function buildOptionsWithClose() {
                return buildOptions().concat([
                    {
                        text: 'Non ho altro da dirti',
                        onSelect: () => {
                            if (window.hideDialogue) window.hideDialogue();
                        }
                    }
                ]);
            }

            window.showDialogue(data.image || '', data.text, buildOptionsWithClose());
        } catch (error) {
            console.error('Errore caricamento dialogo:', error);
            if (window.gameInterface && window.gameInterface.showMessage) {
                window.gameInterface.showMessage('❌ Errore nel caricamento del dialogo.', true);
            }
        }
    }
};

window.DialogueManager = DialogueManager;
