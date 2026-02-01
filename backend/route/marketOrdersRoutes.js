const express = require('express');
const MarketOrder = require('../class/MarketOrders.js');
const MarketOrdersService = require('../service/MarketOrdersService.js');
const router = express.Router();

/**
 * Interactions avec la table 'market_orders'
 */
router.get('/', async (req, res) => {
    try {
        const data = await MarketOrdersService.getAll();
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des market orders' });
    }
});

router.get('/getticker', async (req, res) => {
    const { ticker } = req.query;

    try {
        if (ticker == null) {
            return res.status(400).json({ message: 'Ticker query parameter is empty' });
        }

        const data = await MarketOrdersService.getByCode(ticker);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des market orders pour le ticker ' + ticker });
    }
});

router.get('/getday', async (req, res) => {
    const { day } = req.query;

    try {
        if (day == null) {
            return res.status(400).json({ message: 'Day query parameter is empty' });
        }

        const data = await MarketOrdersService.getByDate(day);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des market orders pour la date ' + day });
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

        const data = await MarketOrdersService.getByCodeAndDate(ticker, day);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération du market order pour ' + ticker + ' à la date ' + day });
    }
});

router.get('/add', async (req, res) => {
    const {
        code,
        order_type,
        order_kind,
        quantity,
        price_order,
        stop_price,
        status
    } = req.query;

    try {
        if (code == null || order_type == null || order_kind == null || quantity == null) {
            return res.status(400).json({ message: 'Missing required query parameters' });
        }

        const newMarketOrder = new MarketOrder({
            code_ticker: code,
            order_type,
            order_kind,
            quantity: Number(quantity),
            price_order: price_order ? Number(price_order) : null,
            stop_price: stop_price ? Number(stop_price) : null,
            status
        });

        await MarketOrdersService.add(newMarketOrder);

        res.status(200).json({
            message: 'Market order correctement ajouté pour le ticker ' + code
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Erreur lors de l\'ajout du market order pour le ticker ' + code
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

        await MarketOrdersService.remove(code, day);

        res.status(200).json({
            message: 'Market orders correctement supprimés pour le ticker ' + code + ' et le jour ' + day
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Erreur lors de la suppression des market orders pour le ticker ' + code + ' et le jour ' + day
        });
    }
});

module.exports = router;