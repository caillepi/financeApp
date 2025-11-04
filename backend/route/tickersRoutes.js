const express = require('express');
const Ticker = require('../class/Ticker');
const TickerService = require('../service/TickerService');
const router = express.Router();

/**
 * Routes pour interagir avec la table 'ticker'
 */
router.get('', async (req, res) => {
    try {
        const data = await TickerService.getAll();

        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({message: 'Erreur lors de la récupération des tickers'});
    }
});

router.get('/add', async (req, res) => {
    const { name, code, isActive, sector, industry, exchange, currency } = req.query;
    try {
        let newTicker = new Ticker(name, code, isActive, sector, industry, exchange, currency);
        await TickerService.add(newTicker);
        res.status(200).json({message: "Element correctement ajouté"});
    }
    catch (err) {
        res.status(500).json({message: "Erreur lors de l'ajout du ticker " + code})
    }
});

router.get('/remove', async (req, res) => {
    const { code } = req.query;
    try {
        await TickerService.remove(code);
        res.status(200).json({message: "Element correctement supprimé"});
    }
    catch (err) {
        res.status(500).json({message: "Erreur lors de la suppression du ticker " + code})
    }
});

router.get('/update', async (req, res) => {
    const { code, isActive } = req.query;
    try {
        await TickerService.update(code, isActive);
        res.status(200).json({message: "Element correctement mis à jour"});
    }
    catch (err) {
        res.status(500).json({message: "Erreur lors de la mise à jour du ticker " + code})
    }
});

module.exports = router;