const express = require('express');
const { withTicker } = require('../utils/routeUtils');
const router = express.Router();


/* Renvoie le nom de l'entreprise */
router.get('/enterprisename', withTicker((req, res, enterprise) => {
    res.status(200).json({ name: enterprise.getName() });
}));

/* Renvoie le secteur d'activité de l'entreprise */
router.get('/sector', withTicker(async (req, res, enterprise) => {
    const sector = await enterprise.getSector();
    res.status(200).json({ sector });
}));

/* Renvoie une description de l'entreprise */
router.get('/description', withTicker(async (req, res, enterprise) => {
    const description = await enterprise.getDescription();
    res.status(200).json({ description });
}));

/* Renvoie le cours actuel de l'action */
router.get('/current', withTicker((req, res, enterprise) => {
    res.status(200).json({ current: enterprise.getCurrent() });
}));

/* Renvoie le minimum sur la dernière journée (ou journée en cours) */
router.get('/low', withTicker((req, res, enterprise) => {
    res.status(200).json({ low: enterprise.getLow() });
}));

/* Renvoie le maximum sur la dernière journée (ou journée en cours) */
router.get('/high', withTicker((req, res, enterprise) => {
    res.status(200).json({ high: enterprise.getHigh() });
}));

/* Renvoie le dernier dividende donné */
router.get('/dividend', withTicker((req, res, enterprise) => {
    let data = enterprise.getDividend();
    res.status(200).json({ dividend: data[0], dividendRate: data[1]});
}));

router.get('/data', withTicker((req, res, enterprise) => {
    res.status(200).json(enterprise.data);
}));

router.get('/industry', withTicker(async (req, res, enterprise) => {
    const industry = await enterprise.getIndustry();
    res.status(200).json({ industry });
}));

router.get('/exchange', withTicker(async (req, res, enterprise) => {
    const exchangeName = await enterprise.getExchangeName();
    res.status(200).json({ exchangeName });
}));

router.get('/currency', withTicker(async (req, res, enterprise) => {
    const currency = await enterprise.getCurrency();
    res.status(200).json({ currency });
}));

router.get('/primaryInfo', withTicker(async (req, res, enterprise) => {
    const name = await enterprise.getName();
    const sector = await enterprise.getSector();
    const industry = await enterprise.getIndustry();
    const exchangeName = await enterprise.getExchangeName();
    const currency = await enterprise.getCurrency();
    res.status(200).json({ 
        name,
        sector,
        industry,
        exchangeName,
        currency
    });
}));

module.exports = router;