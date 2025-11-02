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
        res.status(200).json(tickersScoreData);
    }
    catch (err) {
        res.status(500).json({message: 'Erreur lors de la lecture du fichier CSV'});
    }
});

router.get('/getticker', async (req, res) => {
    try {       
        const { ticker } = req.query;

        if (ticker == null) {
            res.status(400).json({message : 'Ticker query parameter is empty'});
        }
        else {
            // Convertir les instances de TickerScore en objets simples
            let tickersScoreData = tickersScoreReader.convertCsvToJson();
            tickersScoreData = tickersScoreData.filter(item => item.code === ticker)
        
            // Envoyer les données en format JSON
            res.status(200).json(tickersScoreData);
        }
    
    }
    catch (err) {
        res.status(500).json({message : 'Erreur lors de la lecture du fichier CSV'});
    }
});

router.get('/getday', async (req, res) => {
    try {       
        const { day } = req.query;

        if (day == null) {
            res.status(400).json({message : 'Day query parameter is empty'});
        }
        else {
            // Convertir les instances de TickerScore en objets simples
            let tickersScoreData = tickersScoreReader.convertCsvToJson();
            tickersScoreData = tickersScoreData.filter(item => item.day === day);
    
            // Envoyer les données en format JSON
            res.status(200).json(tickersScoreData);
        }

    }
    catch (err) {
        res.status(500).json({message : 'Erreur lors de la lecture du fichier CSV'});
    }
});

router.get('/gettickerandday', async (req, res) => {
    try {       
        const { ticker, day } = req.query;

        if (ticker == null) {
            res.status(400).json({message : 'Ticker query parameter is empty' });
        }
        else if (day == null) {
            res.status(400).json({message : 'Day query parameter is empty' });
        }
        else {
            // Convertir les instances de TickerScore en objets simples
            let tickersScoreData = tickersScoreReader.convertCsvToJson();
            tickersScoreData = tickersScoreData.filter(item => item.day === day);
            tickersScoreData = tickersScoreData.filter(item => item.code === ticker);

            if (tickersScoreData.length == 0) {
                res.status(200).json(tickersScoreData);
            }
            else {
                // Envoyer les données en format JSON
                res.status(200).json(tickersScoreData);
            }
        }

    }
    catch (err) {
        res.status(500).json({message: 'Erreur lors de la lecture du fichier CSV'});
    }
});

router.get('/add', async (req, res) => {
    const { day, code, mm, macd, bollinger, rsi, score } = req.query;

    if (day == null) {
        res.status(400).json({message: 'Day query parameter is empty'});
    }
    else if (code == null) {
        res.status(400).json({message: 'Code query parameter is empty'});
    }
    else if (mm == null) {
        res.status(400).json({message: 'Mm query parameter is empty'});
    }
    else if (macd == null) {
        res.status(400).json({message: 'Macd query parameter is empty'});
    }
    else if (bollinger == null) {
        res.status(400).json({message: 'Bollinger query parameter is empty'});
    }
    else if (rsi == null) {
        res.status(400).json({message: 'Rsi query parameter is empty'});
    }
    else if (score == null) {
        res.status(400).json({message: 'Score query parameter is empty'});
    }
    else {
        let newTickerScore = new TickerScore(day, code, mm, macd, bollinger, rsi, score);
        tickersScoreReader.addTickerScore(newTickerScore);
        res.status(200).json({message: "Element correctement ajouté" + newTickerScore});
    }
});

router.get('/remove', async (req, res) => {
    const { code, day } = req.query;

    if (code == null) {
        res.status(400).json({message: 'Code query parameter is empty'});
    }
    else if (day == null) {
        res.status(400).json({message: 'Day query parameter is empty'});
    }
    else {
        tickersScoreReader.removeTickerScore(code, day);
        res.status(200).json({message: "Element correctement supprimé"});
    }
});

module.exports = router;


/* TEST : http://localhost:5000/addTickerScore?day=2025-07-13&code=CS.PA&mm=12&macd=38&bollinger=34&score=3 */
/* TEST : http://localhost:5000/removeTickerScore?code=CS.PA */