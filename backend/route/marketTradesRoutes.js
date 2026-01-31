const express = require('express');
const MarketTrade = require('../class/MarketTrade');
const MarketTradesService = require('../service/MarketTradesService');
const router = express.Router();

/**
 * Interactions avec la table 'market_trades'
 */
router.get('/', async (req, res) => {
    try {
        const data = await MarketTradesService.getAll();
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des market trades' });
    }
});

router.get('/getticker', async (req, res) => {
    const { ticker } = req.query;

    try {
        if (ticker == null) {
            return res.status(400).json({ message: 'Ticker query parameter is empty' });
        }

        const data = await MarketTradesService.getByCode(ticker);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des market trades pour le ticker ' + ticker });
    }
});

router.get('/getday', async (req, res) => {
    const { day } = req.query;

    try {
        if (day == null) {
            return res.status(400).json({ message: 'Day query parameter is empty' });
        }

        const data = await MarketTradesService.getByDate(day);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des market trades pour la date ' + day });
    }
});

router.get('/gettickerandday', async (req, res) => {
    const { ticker, day } = req.query;

    try {
        if (ticker == null) {
            return res.status(400).json({ message: 'Ticker query parameter is empty' });
        }
        else if (day == null) {
            return res.status(400).json({ message: 'Day query parameter is empty' });
        }

        const data = await MarketTradesService.getByCodeAndDate(ticker, day);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des market trades pour ' + ticker + ' à la date ' + day
        });
    }
});

router.get('/add', async (req, res) => {
    const {
        code,
        order_id,
        trade_type,
        quantity,
        price,
        fees
    } = req.query;

    try {
        if (code == null || order_id == null || trade_type == null || quantity == null || price == null) {
            return res.status(400).json({ message: 'Missing required query parameters' });
        }

        const newMarketTrade = new MarketTrade({
            code_ticker: code,
            order_id: Number(order_id),
            trade_type,
            quantity: Number(quantity),
            price: Number(price),
            fees: fees ? Number(fees) : null
        });

        await MarketTradesService.add(newMarketTrade);

        res.status(200).json({
            message: 'Market trade correctement ajouté pour le ticker ' + code
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Erreur lors de l\'ajout du market trade pour le ticker ' + code
        });
    }
});

router.get('/remove', async (req, res) => {
    const { code, day } = req.query;

    try {
        if (code == null) {
            return res.status(400).json({ message: 'Code query parameter is empty' });
        }
        else if (day == null) {
            return res.status(400).json({ message: 'Day query parameter is empty' });
        }

        await MarketTradesService.remove(code, day);

        res.status(200).json({
            message: 'Market trades correctement supprimés pour le ticker ' + code + ' et le jour ' + day
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Erreur lors de la suppression des market trades pour le ticker ' + code + ' et le jour ' + day
        });
    }
});

module.exports = router;
