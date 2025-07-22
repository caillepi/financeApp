const express = require('express');
const { withTicker } = require('../utils/routeUtils');
const router = express.Router();

/* Renvoie le minimum sur une période donnée (minimum parmi les minimums) */
router.get('/min', withTicker((req, res, _, analyst) => {
    const { period } = req.query;
    let data = analyst.getLowData(period);
    res.send(Math.min(...data));
}));

/* Renvoie le maximum sur une période donnée (maximum parmi les maximums) */
router.get('/max', withTicker((req, res, _, analyst) => {
    const { period } = req.query;
    let data = analyst.getHighData(period);
    res.send(Math.max(...data));
}));

/* Renvoie la liste de tous les minimums sur une période par défaut */
router.get('/mindata', withTicker((req, res, _, analyst) => {
    const { period } = req.query;
    res.send(analyst.getLowData(period));
}));

/* Renvoie la liste de tous les maximums sur une période par défaut */
router.get('/maxdata', withTicker((req, res, _, analyst) => {
    const { period } = req.query;
    res.send(analyst.getHighData(period));
}));

/* Renvoie les cours d'ouverture sur la période par défaut */
router.get('/opendata', withTicker((req, res, _, analyst) => {
    res.send(analyst.getOpenData());
}));

/* Renvoie les cours de fermeture sur la période par défaut */
router.get('/closedata', withTicker((req, res, _, analyst) => {
    res.send(analyst.getCloseData());
}));

/* Renvoie les volumes échangés sur la période par défaut */
router.get('/volumedata', withTicker((req, res, _, analyst) => {
    res.send(analyst.getVolumeData());
}));

/* Renvoie les dates de la période par défaut */
router.get('/date', withTicker((req, res, _, analyst) => {
    res.send(analyst.getDateData());
}));

/* Renvoie la moyenne des cours de cloture sur la période par défaut */
router.get('/mean', withTicker((req, res, _, analyst) => {
    const { period } = req.query;
    res.send(analyst.getMean(period));
}));

router.get('/rsi', withTicker((req, res, _, analyst) => {
    res.send(analyst.getRSI());
}));

/* Renvoie la liste des SMA sur une période donnée */
router.get('/sma', withTicker((req, res, _, analyst) => {
    const { period } = req.query;
    res.send(analyst.getSMA(period));
}));

/* Renvoie la liste des MACD sur la période par défaut */
router.get('/macd', withTicker((req, res, _, analyst) => {
    res.send(analyst.getMACD());
}));

/* Renvoie la liste des EMA sur une période de 12 */
router.get('/ema', withTicker((req, res, _, analyst) => {
    const { period } = req.query;
    res.send(analyst.getEMA(period));
}));

/* Renvoie la liste des EMA sur une période de 20 */
router.get('/bollingerband', withTicker((req, res, _, analyst) => {
    res.send(analyst.getBollingerBand(20));
}));

module.exports = router;