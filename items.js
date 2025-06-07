// ===== DATABASE OGGETTI =====

const Items = {
    // Ogni oggetto ha solo nome, descrizione e immagine
    
    "Spada": {
        description: "Una spada di ferro ben affilata. Lucente e pesante.",
        image: "assets/images/items/spada.jpg"
    },
    
    "Scudo": {
        description: "Uno scudo di legno rinforzato con borchie metalliche.",
        image: "assets/images/items/scudo.jpg"
    },
    
    "Pozione": {
        description: "Una piccola fiala con un liquido rosso che sembra curativo.",
        image: "assets/images/items/pozione.jpg"
    },
    
    "Corda": {
        description: "Una robusta corda di canapa lunga circa 10 metri.",
        image: "assets/images/items/corda.jpg"
    },
    
    "Candela": {
        description: "Una candela di cera con stoppino intatto. Può dare luce.",
        image: "assets/images/items/candela.jpg"
    },
    
    "Martello": {
        description: "Un martello da fabbro pesante e robusto.",
        image: "assets/images/items/martello.jpg"
    },

    "Chiave": {
        description: "Una semplice chiave di ferro. Potrebbe aprire qualcosa.",
        image: "assets/images/items/chiave.jpg"
    },

    "Chiave arrugginita": {
        description: "Una vecchia chiave di ferro coperta di ruggine.",
        image: "assets/images/items/chiave_arrugginita.jpg"
    },
    
    "Mappa": {
        description: "Una mappa del castello disegnata su pergamena antica.",
        image: "assets/images/items/mappa.jpg"
    },
    
    "Lanterna": {
        description: "Una lanterna di metallo con vetro. Illumina meglio della candela.",
        image: "assets/images/items/lanterna.jpg"
    },
    
    "Pergamena": {
        description: "Un rotolo di pergamena con scritte in caratteri antichi.",
        image: "assets/images/items/pergamena.jpg"
    },
    
    "Tizzone ardente": {
        description: "Un pezzo di legno che brucia. Utile come torcia improvvisata.",
        image: "assets/images/items/tizzone.jpg"
    },
    
    "Lima": {
        description: "Una lima di metallo per tagliare sbarre o serrature.",
        image: "assets/images/items/lima.jpg"
    },
    
    "Anello di ferro": {
        description: "Un pesante anello di ferro che può essere usato come leva.",
        image: "assets/images/items/anello_ferro.jpg"
    },
    
    "Chiave del castello": {
        description: "Una chiave dorata con lo stemma reale. Apre molte porte.",
        image: "assets/images/items/chiave_castello.jpg"
    },
    
    "Cucchiaio arrugginito": {
        description: "Un vecchio cucchiaio di metallo. Non è molto utile per mangiare.",
        image: "assets/images/items/cucchiaio.jpg"
    },
    
    "Pezzo di pane secco": {
        description: "Un tozzo di pane duro come sasso. Forse ha altri usi.",
        image: "assets/images/items/pane.jpg"
    },
    
    "Straccio sporco": {
        description: "Un pezzo di stoffa sporco ma resistente.",
        image: "assets/images/items/straccio.jpg"
    },
    
    "Chiodo piegato": {
        description: "Un chiodo di ferro piegato. Potrebbe funzionare come grimaldello.",
        image: "assets/images/items/chiodo.jpg"
    },
    
    "Sassolino": {
        description: "Una piccola pietra rotonda e levigata.",
        image: "assets/images/items/sassolino.jpg"
    },
    
    "Torcia accesa": {
        description: "Una torcia che brucia vivacemente e illumina bene.",
        image: "assets/images/items/torcia.jpg"
    },
    
    "Candelabro dorato": {
        description: "Un elegante candelabro d'oro decorato con gemme.",
        image: "assets/images/items/candelabro.jpg"
    },
    
    "Penna di fenice": {
        description: "Una penna magica che brilla di luce propria.",
        image: "assets/images/items/penna_fenice.jpg"
    },
    
    "Calamaio magico": {
        description: "Un calamaio con inchiostro che scintilla misteriosamente.",
        image: "assets/images/items/calamaio.jpg"
    },
    
    "Pergamena incantata": {
        description: "Una pergamena scritta con inchiostro magico. I simboli sembrano muoversi.",
        image: "assets/images/items/pergamena_incantata.jpg"
    },
    
    "Combinazione stellare": {
        description: "Una sequenza di numeri rivelata dalle stelle. Potrebbe aprire qualcosa.",
        image: "assets/images/items/combinazione.jpg"
    },
    
    "Chiave della saggezza": {
        description: "Una chiave ornata con simboli di conoscenza. Molto antica.",
        image: "assets/images/items/chiave_saggezza.jpg"
    },
    
    "Chiave del tempo": {
        description: "Una chiave che sembra fluttuare leggermente. Ha inciso un orologio.",
        image: "assets/images/items/chiave_tempo.jpg"
    },
    
    "Incantesimo di apertura": {
        description: "La conoscenza di un incantesimo per aprire porte magiche.",
        image: "assets/images/items/incantesimo.jpg"
    },
    
    "Conoscenza antica": {
        description: "Saggezza accumulata dall'antica biblioteca. Ti fa sentire più saggio.",
        image: "assets/images/items/conoscenza.jpg"
    },
    "Pistola Laser HF-27": {
        description: "Un'arma datata ma ancora funzionante. Non ha molti colpi ma può servire.",
        image: "assets/images/items/hf27_laser.png"
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