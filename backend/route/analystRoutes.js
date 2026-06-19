const express = require('express');
const { withTicker } = require('../utils/routeUtils');
const router = express.Router();

// Fonction utilitaire pour vérifier le paramètre period
function checkPeriod(req, res) {
    const { period } = req.query;
    if (period == null) {
        res.status(400).json({ error: 'Period query parameter is empty' });
        return null;
    }
    return period;
}

/* Renvoie le minimum sur une période donnée */
router.get('/:ticker/min', withTicker((req, res, _, analyst) => {
    const period = checkPeriod(req, res);
    if (!period) return;

    const data = analyst.getLowData(period);
    if (!data || data === 'N/A') {
        res.status(200).json({ min: 'N/A' });
    } else {
        res.status(200).json({ min: Math.min(...data) });
    }
}));

/* Renvoie le maximum sur une période donnée */
router.get('/:ticker/max', withTicker((req, res, _, analyst) => {
    const period = checkPeriod(req, res);
    if (!period) return;

    const data = analyst.getHighData(period);
    if (!data || data === 'N/A') {
        res.status(200).json({ max: 'N/A' });
    } else {
        res.status(200).json({ max: Math.max(...data) });
    }
}));

/* Liste des minimums sur la période */
router.get('/:ticker/mindata', withTicker((req, res, _, analyst) => {
    const period = checkPeriod(req, res);
    if (!period) return;

    res.status(200).json({ mindata: analyst.getLowData(period) });
}));

/* Liste des maximums sur la période */
router.get('/:ticker/maxdata', withTicker((req, res, _, analyst) => {
    const period = checkPeriod(req, res);
    if (!period) return;

    res.status(200).json({ maxdata: analyst.getHighData(period) });
}));

/* Cours d'ouverture */
router.get('/:ticker/opendata', withTicker((req, res, _, analyst) => {
    res.status(200).json({ opendata: analyst.getOpenData() });
}));

/* Cours de fermeture */
router.get('/:ticker/closedata', withTicker((req, res, _, analyst) => {
    res.status(200).json({ closedata: analyst.getCloseData() });
}));

/* Volumes échangés */
router.get('/:ticker/volumedata', withTicker((req, res, _, analyst) => {
    res.status(200).json({ volumedata: analyst.getVolumeData() });
}));

/* Dates de la période */
router.get('/:ticker/date', withTicker((req, res, _, analyst) => {
    res.status(200).json({ dates: analyst.getDateData() });
}));

/* Moyenne des cours de clôture */
router.get('/:ticker/mean', withTicker((req, res, _, analyst) => {
    const period = checkPeriod(req, res);
    if (!period) return;

    res.status(200).json({ mean: analyst.getMean(period) });
}));

/* RSI */
router.get('/:ticker/rsi', withTicker((req, res, _, analyst) => {
    res.status(200).json({ rsi: analyst.getRSI() });
}));

/* SMA */
router.get('/:ticker/sma', withTicker((req, res, _, analyst) => {
    const period = checkPeriod(req, res);
    if (!period) return;

    res.status(200).json({ sma: analyst.getSMA(period) });
}));

/* MACD */
router.get('/:ticker/macd', withTicker((req, res, _, analyst) => {
    res.status(200).json({ macd: analyst.getMACD() });
}));

/* EMA */
router.get('/:ticker/ema', withTicker((req, res, _, analyst) => {
    const period = checkPeriod(req, res);
    if (!period) return;

    res.status(200).json({ ema: analyst.getEMA(period) });
}));

/* Bollinger Band sur période fixe */
router.get('/:ticker/bollingerband', withTicker((req, res, _, analyst) => {
    res.status(200).json({ bollingerband: analyst.getBollingerBand(20) });
}));

module.exports = router;