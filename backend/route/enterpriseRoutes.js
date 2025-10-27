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

module.exports = router;