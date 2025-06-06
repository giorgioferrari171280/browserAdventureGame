// ===== DATABASE OGGETTI =====

const Items = {
    // Ogni oggetto ha solo nome, descrizione e immagine
    
    "Spada": {
        description: "Una spada di ferro ben affilata. Lucente e pesante.",
        image: "images/items/spada.jpg"
    },
    
    "Scudo": {
        description: "Uno scudo di legno rinforzato con borchie metalliche.",
        image: "images/items/scudo.jpg"
    },
    
    "Pozione": {
        description: "Una piccola fiala con un liquido rosso che sembra curativo.",
        image: "images/items/pozione.jpg"
    },
    
    "Corda": {
        description: "Una robusta corda di canapa lunga circa 10 metri.",
        image: "images/items/corda.jpg"
    },
    
    "Candela": {
        description: "Una candela di cera con stoppino intatto. Può dare luce.",
        image: "images/items/candela.jpg"
    },
    
    "Martello": {
        description: "Un martello da fabbro pesante e robusto.",
        image: "images/items/martello.jpg"
    },
    
    "Chiave arrugginita": {
        description: "Una vecchia chiave di ferro coperta di ruggine.",
        image: "images/items/chiave_arrugginita.jpg"
    },
    
    "Mappa": {
        description: "Una mappa del castello disegnata su pergamena antica.",
        image: "images/items/mappa.jpg"
    },
    
    "Lanterna": {
        description: "Una lanterna di metallo con vetro. Illumina meglio della candela.",
        image: "images/items/lanterna.jpg"
    },
    
    "Pergamena": {
        description: "Un rotolo di pergamena con scritte in caratteri antichi.",
        image: "images/items/pergamena.jpg"
    },
    
    "Tizzone ardente": {
        description: "Un pezzo di legno che brucia. Utile come torcia improvvisata.",
        image: "images/items/tizzone.jpg"
    },
    
    "Lima": {
        description: "Una lima di metallo per tagliare sbarre o serrature.",
        image: "images/items/lima.jpg"
    },
    
    "Anello di ferro": {
        description: "Un pesante anello di ferro che può essere usato come leva.",
        image: "images/items/anello_ferro.jpg"
    },
    
    "Chiave del castello": {
        description: "Una chiave dorata con lo stemma reale. Apre molte porte.",
        image: "images/items/chiave_castello.jpg"
    },
    
    "Cucchiaio arrugginito": {
        description: "Un vecchio cucchiaio di metallo. Non è molto utile per mangiare.",
        image: "images/items/cucchiaio.jpg"
    },
    
    "Pezzo di pane secco": {
        description: "Un tozzo di pane duro come sasso. Forse ha altri usi.",
        image: "images/items/pane.jpg"
    },
    
    "Straccio sporco": {
        description: "Un pezzo di stoffa sporco ma resistente.",
        image: "images/items/straccio.jpg"
    },
    
    "Chiodo piegato": {
        description: "Un chiodo di ferro piegato. Potrebbe funzionare come grimaldello.",
        image: "images/items/chiodo.jpg"
    },
    
    "Sassolino": {
        description: "Una piccola pietra rotonda e levigata.",
        image: "images/items/sassolino.jpg"
    },
    
    "Torcia accesa": {
        description: "Una torcia che brucia vivacemente e illumina bene.",
        image: "images/items/torcia.jpg"
    },
    
    "Candelabro dorato": {
        description: "Un elegante candelabro d'oro decorato con gemme.",
        image: "images/items/candelabro.jpg"
    },
    
    "Penna di fenice": {
        description: "Una penna magica che brilla di luce propria.",
        image: "images/items/penna_fenice.jpg"
    },
    
    "Calamaio magico": {
        description: "Un calamaio con inchiostro che scintilla misteriosamente.",
        image: "images/items/calamaio.jpg"
    },
    
    "Pergamena incantata": {
        description: "Una pergamena scritta con inchiostro magico. I simboli sembrano muoversi.",
        image: "images/items/pergamena_incantata.jpg"
    },
    
    "Combinazione stellare": {
        description: "Una sequenza di numeri rivelata dalle stelle. Potrebbe aprire qualcosa.",
        image: "images/items/combinazione.jpg"
    },
    
    "Chiave della saggezza": {
        description: "Una chiave ornata con simboli di conoscenza. Molto antica.",
        image: "images/items/chiave_saggezza.jpg"
    },
    
    "Chiave del tempo": {
        description: "Una chiave che sembra fluttuare leggermente. Ha inciso un orologio.",
        image: "images/items/chiave_tempo.jpg"
    },
    
    "Incantesimo di apertura": {
        description: "La conoscenza di un incantesimo per aprire porte magiche.",
        image: "images/items/incantesimo.jpg"
    },
    
    "Conoscenza antica": {
        description: "Saggezza accumulata dall'antica biblioteca. Ti fa sentire più saggio.",
        image: "images/items/conoscenza.jpg"
    }
};

// Funzione per ottenere un oggetto
function getItem(itemName) {
    return Items[itemName] || null;
}

// Funzione per controllare se un oggetto esiste
function itemExists(itemName) {
    return itemName in Items;
}

// Funzione per ottenere tutti i nomi oggetti
function getAllItemNames() {
    return Object.keys(Items);
}

// Esposizione globale
window.Items = Items;
window.getItem = getItem;
window.itemExists = itemExists;
window.getAllItemNames = getAllItemNames;

console.log(`📦 Database oggetti caricato: ${Object.keys(Items).length} oggetti disponibili`);