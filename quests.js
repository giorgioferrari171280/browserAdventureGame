const Quests = {
    main: {
        id: 'fuga_castello',
        name: 'Fuga dal Castello',
        achievementFlag: 'ach_fuga_castello',
        tasks: [
            { description: 'Trova la chiave della cella', flag: 'item_chiave', completed: false },
            { description: 'Apri la cella', flag: 'porta_aperta', completed: false },
            { description: 'Raggiungi il cortile', flag: 'visited_giardino_segreto', completed: false }
        ],
        completed: false
    },
    sides: []
};

window.Quests = Quests;

const QuestManager = {
    updateForFlag(flagName) {
        ['main', 'sides'].forEach(cat => {
            const quests = cat === 'main' ? [Quests.main] : Quests.sides;
            quests.forEach(q => {
                q.tasks.forEach(t => {
                    if (!t.completed && (!flagName || t.flag === flagName)) {
                        if (window.GameState && window.GameState.hasFlag(t.flag)) {
                            t.completed = true;
                        }
                    }
                });
                this.checkCompletion(q);
            });
        });
        if (typeof window.updateQuestOverlay === 'function') {
            window.updateQuestOverlay();
        }
    },

    checkCompletion(quest) {
        if (!quest.completed && quest.tasks.every(t => t.completed)) {
            quest.completed = true;
            if (window.GameState) {
                window.GameState.addCompletedQuest(quest.id);
                if (quest.achievementFlag) {
                    window.GameState.setFlag(quest.achievementFlag);
                }
            }
        }
    }
};

window.QuestManager = QuestManager;
