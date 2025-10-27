const express = require('express');
const yahooFinance = require('yahoo-finance2').default;
const router = express.Router();


router.get('/dailygainers', async (req, res) => {
    try {
        const queryOptions = { count: 10, region: 'FR', lang: 'fr-FR', market: 'fr_market' };
        const result = await yahooFinance.dailyGainers(queryOptions);

        res.json(result);
    }
    catch (err) {
        res.json(err.result);
    }
});

module.exports = router;