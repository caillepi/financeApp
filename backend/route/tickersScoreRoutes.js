const express = require('express');
const TickerScore = require('../class/TickerScore');
const TickerScoreService = require('../service/TickerScoreService');
const router = express.Router();

/**
 * Interactions avec la table 'tickerScore' de la BDD
 */
router.get('/', async (req, res) => {
    try {
        const data = await TickerScoreService.getAll();

        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({message: 'Erreur lors de la récupération des tickers'});
    }
});

router.get('/getticker', async (req, res) => {
    const { ticker } = req.query;

    try {       
        if (ticker == null) {
            res.status(400).json({message : 'Ticker query parameter is empty'});
        }
       
        const data = await TickerScoreService.getByCode(ticker);

        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({message : 'Erreur lors de la récupération des tickerScores pour le ticker ' + ticker});
    }
});

router.get('/getday', async (req, res) => {
    const { day } = req.query;

    try {
        if (day == null) {
            res.status(400).json({message : 'Day query parameter is empty'});
        }
       
        const data = await TickerScoreService.getByDate(day);

        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({message : 'Erreur lors de la récupération des tickerScores pour la date ' + day});
    }
});

router.get('/gettickerandday', async (req, res) => {
    const { ticker, day } = req.query;

    try {       
        if (ticker == null) {
            res.status(400).json({message : 'Ticker query parameter is empty' });
        }
        else if (day == null) {
            res.status(400).json({message : 'Day query parameter is empty' });
        }

        const data = await TickerScoreService.getByCodeAndDate(ticker, day);

        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({message: 'Erreur lors de la récupération du ticker ' + ticker + " pour la date " + day});
    }
});

router.get('/add', async (req, res) => {
    const { day, code, mm, macd, bollinger, rsi, score } = req.query;

    try {
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
        
        let newTickerScore = new TickerScore(code, mm, macd, bollinger, rsi, score);
        TickerScoreService.add(newTickerScore);
        res.status(200).json({message: "tickerScore correctement ajouté pour le ticker" + newTickerScore.code + " et la date " + day});
    }
    catch (err) {
        res.status(500).json({message: 'Erreur lors de l\'ajout du tickerScore pour le ticker ' + code})
    }

});

router.get('/remove', async (req, res) => {
    const { code, day } = req.query;

    try {
        if (code == null) {
            res.status(400).json({message: 'Code query parameter is empty'});
        }
        else if (day == null) {
            res.status(400).json({message: 'Day query parameter is empty'});
        }

        TickerScoreService.remove(code, day);
        res.status(200).json({message: "tickerScore correctement supprimé pour le ticker " + code + " et pour le jour " + day});
    }
    catch (err) {
        res.status(500).json({message: "Erreur lors de la suppression du tickerScore pour le ticker " + code + " et pour le jour " + day});
    }
});

module.exports = router;