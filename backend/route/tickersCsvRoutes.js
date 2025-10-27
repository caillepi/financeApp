const express = require('express');
const TickerReader = require('../class/TickerReader');
const Ticker = require('../class/Ticker');
const { isAuthenticated } = require('../middleware/sessionProtection');
const router = express.Router();

let tickerReader = new TickerReader();
tickerReader.init();

/**
 * Interactions avec tickers.csv
 */
router.get('', async (req, res) => {
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

router.get('/add', isAuthenticated, async (req, res) => {
    const { name, code, isActive } = req.query;
    let newTicker = new Ticker(name, code, isActive);
    tickerReader.addTicker(newTicker);
    res.send("Element correctement ajouté");
})

router.get('/remove', isAuthenticated, async (req, res) => {
    const { code } = req.query;
    tickerReader.removeTicker(code);
    res.send("Element correctement supprimé");
})

router.get('/update', isAuthenticated, async (req, res) => {
    const { code, isActive } = req.query;
    tickerReader.updateTicker(code, isActive);
    res.send("Element correctement mis à jour");
})

module.exports = router;