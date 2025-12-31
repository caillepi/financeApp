
// variable d'environnement
require('dotenv').config()

const express = require('express');
const session = require('express-session');

// intialisation de l'application express
const app = express();
const port = process.env.PORT || 5000;
var cors = require('cors');

const { withTicker } = require('./utils/routeUtils.js')

// import des routes
const sessionRouter = require('./route/sessionRoutes.js');
const tickersRouter = require('./route/tickersRoutes.js');
const tickersScoreRouter = require('./route/tickersScoreRoutes.js');
const kpiRouter = require('./route/kpiRoutes.js');
const enterpriseRouter = require('./route/enterpriseRoutes.js');
const analystRouter = require('./route/analystRoutes.js');
const tickersExplorerRouter = require('./route/tickersExplorerRoutes.js');
const screenerRouter = require('./route/screenerRoutes.js');
const { isAuthenticated } = require('./middleware/sessionProtection.js');

// middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));
app.use(express.json());

// Configurer les sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,          // À mettre à true si tu utilises HTTPS
        maxAge: 60 * 60 * 1000  // Durée de la session en millisecondes (ici 1 heure)
    }
}));

// routes publiques
app.use('/session', sessionRouter);

// routes authentifiées
app.use('/enterprise', isAuthenticated, enterpriseRouter);
app.use('/analyst', isAuthenticated, analystRouter);
app.use('/kpi', isAuthenticated, kpiRouter);
app.use('/tickers', isAuthenticated, tickersRouter);
app.use('/tickersScore', isAuthenticated, tickersScoreRouter);
app.use('/tickersExplore', isAuthenticated, tickersExplorerRouter);
app.use('/screener', isAuthenticated, screenerRouter);

/**
 * Lancer le serveur
 */
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
