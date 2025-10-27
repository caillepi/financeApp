const express = require('express');
const { withTicker } = require('../utils/routeUtils');
const router = express.Router();

router.get('/close', withTicker((req, res, _, analyst) => {
    res.status(200).json({ close: analyst.getKpiSma() });
}));

router.get('/bollinger', withTicker((req, res, _, analyst) => {
    res.status(200).json({ bollinger: analyst.getKpiBollinger() });
}));

router.get('/macd', withTicker((req, res, _, analyst) => {
    res.status(200).json({ macd: analyst.getKpiMacd() });
}));

router.get('/rsi', withTicker((req, res, _, analyst) => {
    res.status(200).json({ rsi: analyst.getKpiRsi() });
}));

module.exports = router;
