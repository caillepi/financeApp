const express = require('express');
const router = express.Router();
const yahooFinance = require('yahoo-finance2').default;

router.get('/most_active_fr', async (req, res) => {
  try {
    // Correct usage
    const results = await yahooFinance.screener('most_actives_fr', {
      count: 100,
    });

    res.json({
      region: 'France',
      count: results.finance.result[0].total || results.finance.result[0].quotes.length,
      quotes: results.finance.result[0].quotes.map(q => ({
        symbol: q.symbol,
        longName: q.longName,
        price: q.regularMarketPrice,
        change: q.regularMarketChange,
        changePercent: q.regularMarketChangePercent,
        volume: q.regularMarketVolume,
      })),
    });

    // If you just want raw results:
    // res.send(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;