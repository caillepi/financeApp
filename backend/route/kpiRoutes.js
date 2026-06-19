const express = require('express');
const { withTicker } = require('../utils/routeUtils');
const router = express.Router();

router.get('/:ticker/sma', withTicker((req, res, _, analyst) => {
    res.status(200).json({ sma: analyst.getKpiSma() });
}));

router.get('/:ticker/bollinger', withTicker((req, res, _, analyst) => {
    res.status(200).json({ bollinger: analyst.getKpiBollinger() });
}));

router.get('/:ticker/macd', withTicker((req, res, _, analyst) => {
    res.status(200).json({ macd: analyst.getKpiMacd() });
}));

router.get('/:ticker/rsi', withTicker((req, res, _, analyst) => {
    res.status(200).json({ rsi: analyst.getKpiRsi() });
}));

module.exports = router;
