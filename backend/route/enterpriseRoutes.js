const express = require('express');
const { withTicker } = require('../utils/routeUtils');
const router = express.Router();

/* Renvoie le nom de l'entreprise */
router.get('/enterprisename', withTicker((req, res, enterprise, _) => {
    res.send(enterprise.getName())
}));

/* Renvoie le secteur d'activité de l'entreprise */
router.get('/sector', withTicker(async (req, res, enterprise, _) => {
    res.send(await enterprise.getSector());
}));

/* Renvoie une description de l'entreprise */
router.get('/description', withTicker(async (req, res, enterprise, _) => {
    res.send(await enterprise.getDescription());
}));

/* Renvoie le cours actuel de l'action */
router.get('/current', withTicker((req, res, enterprise, _) => {
    res.send(enterprise.getCurrent());
}));

/* Renvoie le minimum sur la dernière journée (ou journée en cours) */
router.get('/low', withTicker((req, res, enterprise, _) => {
    res.send(enterprise.getLow());
}));

/* Renvoie le maximum sur la dernière journée (ou journée en cours) */
router.get('/high', withTicker((req, res, enterprise, _) => {
    res.send(enterprise.getHigh());
}));

module.exports = router;