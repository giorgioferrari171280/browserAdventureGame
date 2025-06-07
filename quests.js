const Quests = {
    main: {
        id: 'fuga_castello',
        name: 'Fuga dal Castello',
        tasks: [
            { description: 'Trova la chiave della cella', completed: false },
            { description: 'Apri la cella', completed: false },
            { description: 'Raggiungi il cortile', completed: false }
        ]
    },
    sides: []
};

window.Quests = Quests;

const QuestManager = {
    markTaskCompleted(category, questId, taskIndex) {
        let quest = null;
        if (category === 'main' && Quests.main.id === questId) {
            quest = Quests.main;
        } else if (category === 'sides') {
            quest = Quests.sides.find(q => q.id === questId);
        }
        if (!quest || !quest.tasks[taskIndex]) return;
        if (!quest.tasks[taskIndex].completed) {
            quest.tasks[taskIndex].completed = true;
            if (typeof window.updateQuestOverlay === 'function') {
                window.updateQuestOverlay();
            }
        }
    }
};

window.QuestManager = QuestManager;
