const express = require('express');
const { withTicker } = require('../utils/routeUtils');
const router = express.Router();

router.get('/close', withTicker((req, res, _, analyst) => {
    res.send(analyst.getKpiSma());
}));

router.get('/bollinger', withTicker((req, res, _, analyst) => {
    res.send(analyst.getKpiBollinger());
}));

router.get('/macd', withTicker((req, res, _, analyst) => {
    res.send(analyst.getKpiMacd());
}));

router.get('/rsi', withTicker((req, res, _, analyst) => {
    res.send(analyst.getKpiRsi());
}));

module.exports = router;