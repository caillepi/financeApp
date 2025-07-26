const express = require('express');
const TickerReader = require('../class/TickerReader');
const router = express.Router();

let tickerReader = new TickerReader();
tickerReader.init();

/**
 * Interactions avec tickers.csv
 */
router.get('/tickers', async (req, res) => {
    try {       
        // Convertir les instances de Ticker en objets simples
        const tickersData = tickerReader.convertCsvToJson();

        // Envoyer les données en format JSON
        res.json(tickersData);
    }
    catch (err) {
        res.status(500).send('Erreur lors de la lecture du fichier CSV');
    }
})

router.get('/addTicker', async (req, res) => {
    const { name, code, isActive } = req.query;
    let newTicker = new Ticker(name, code, isActive);
    tickerReader.addTicker(newTicker);
    res.send("Element correctement ajouté");
})

router.get('/removeticker', async (req, res) => {
    const { code } = req.query;
    tickerReader.removeTicker(code);
    res.send("Element correctement supprimé");
})

router.get('/updateTicker', async (req, res) => {
    const { code, isActive } = req.query;
    tickerReader.updateTicker(code, isActive);
    res.send("Element correctement mis à jour");
})

module.exports = router;