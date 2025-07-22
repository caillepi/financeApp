const express = require('express');
const TickerScoreReader = require('../class/TickerScoreReader');
const TickerScore = require('../class/TickerScore');
const router = express.Router();

let tickersScoreReader = new TickerScoreReader();
tickersScoreReader.init();

/**
 * Interactions avec tickersScore.csv
 */
router.get('/', async (req, res) => {
    try {       
        // Convertir les instances de TickerScore en objets simples
        const tickersScoreData = tickersScoreReader.convertCsvToJson();

        // Envoyer les données en format JSON
        res.json(tickersScoreData);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la lecture du fichier CSV');
    }
});

router.get('/getticker', async (req, res) => {
    try {       
        const { ticker } = req.query;

        // Convertir les instances de TickerScore en objets simples
        let tickersScoreData = tickersScoreReader.convertCsvToJson();
        tickersScoreData = tickersScoreData.filter(item => item.code === ticker)

        // Envoyer les données en format JSON
        res.json(tickersScoreData);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la lecture du fichier CSV');
    }
});

router.get('/getday', async (req, res) => {
    try {       
        const { day } = req.query;

        // Convertir les instances de TickerScore en objets simples
        let tickersScoreData = tickersScoreReader.convertCsvToJson();
        tickersScoreData = tickersScoreData.filter(item => item.day === day);

        // Envoyer les données en format JSON
        res.json(tickersScoreData);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la lecture du fichier CSV');
    }
});

router.get('/gettickerandday', async (req, res) => {
    try {       
        const { ticker, day } = req.query;

        // Convertir les instances de TickerScore en objets simples
        let tickersScoreData = tickersScoreReader.convertCsvToJson();
        tickersScoreData = tickersScoreData.filter(item => item.day === day);
        tickersScoreData = tickersScoreData.filter(item => item.code === ticker);

        // Envoyer les données en format JSON
        res.json(tickersScoreData);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la lecture du fichier CSV');
    }
});

router.get('/add', async (req, res) => {
    const { day, code, mm, macd, bollinger, rsi, score } = req.query;
    let newTickerScore = new TickerScore(day, code, mm, macd, bollinger, rsi, score);
    tickersScoreReader.addTickerScore(newTickerScore);
    res.send("Element correctement ajouté" + newTickerScore);
});

router.get('/remove', async (req, res) => {
    const { code, day } = req.query;
    tickersScoreReader.removeTickerScore(code, day);
    res.send("Element correctement supprimé");
});

module.exports = router;


/* TEST : http://localhost:5000/addTickerScore?day=2025-07-13&code=CS.PA&mm=12&macd=38&bollinger=34&score=3 */
/* TEST : http://localhost:5000/removeTickerScore?code=CS.PA */