
// variable d'environnement
require('dotenv').config()

// intialisation de l'application express
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
var cors = require('cors');

const { withTicker } = require('./utils/routeUtils.js')

// import des routes
const tickersCsvRouter = require('./route/tickersCsvRoutes.js');
const tickersScoreCsvRouter = require('./route/tickersScoreCsvRoutes.js');
const kpiRouter = require('./route/kpiRoutes.js');
const enterpriseRouter = require('./route/enterpriseRoutes.js');
const analystRouter = require('./route/analystRoutes.js');
const tickersExplorerRouter = require('./route/tickersExplorerRoutes.js');

// middleware
app.use(cors());

// routes
/**
 * Routes pour l'analyse des actions en bourse
 */
app.get('/', withTicker((req, res, _, analyst) => {
    res.send(analyst);
}));

/**
 * Routes avec l'objet Enterprise
 */
app.use('/', enterpriseRouter);

/**
 * Routes avec l'objet Analyst
 */
app.use('/', analystRouter);

/**
 * Récupérer les KPIs
 */
app.use('/kpi', kpiRouter);

/**
 * Interactions avec tickers.csv
 */
app.use('/', tickersCsvRouter);

/**
 * Interactions avec tickersScore.csv
 */
app.use('/tickersScore', tickersScoreCsvRouter);

/**
 * Récupérer des nouveaux tickers
 */
app.use('/', tickersExplorerRouter);

/**
 * Lancer le serveur
 */
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
