// ===== DATABASE PERSONAGGI (NPC) =====

const NPCs = {
    // Ogni personaggio ha nome, descrizione e immagine
    "Droide XC-1230": {
        description: "Droide di sorveglianza modello XC-1230. Controlla l'accesso alle aree riservate.",
        image: "assets/images/npcs/droide_xc1230.jpg"
    }
};

// Funzione per ottenere un NPC
function getNPC(npcName) {
    return NPCs[npcName] || null;
}
