
// variable d'environnement
require('dotenv').config()

const express = require('express');
const session = require('express-session');

// intialisation de l'application express
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'];
const configuredOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])];

// import des routes
const sessionRouter = require('./route/sessionRoutes.js');
const tickersRouter = require('./route/tickersRoutes.js');
const tickersScoreRouter = require('./route/tickersScoreRoutes.js');
const marketOrdersRouter = require('./route/marketOrdersRoutes.js');
const marketTradesRouter = require('./route/marketTradesRoutes.js');
const kpiRouter = require('./route/kpiRoutes.js');
const enterpriseRouter = require('./route/enterpriseRoutes.js');
const analystRouter = require('./route/analystRoutes.js');
const tickersExplorerRouter = require('./route/tickersExplorerRoutes.js');
const screenerRouter = require('./route/screenerRoutes.js');
const cacheDebugRouter = require('./route/cacheDebugRoutes.js');
const discordRouter = require('./route/discordRoutes.js');
const { isAuthenticated } = require('./middleware/sessionProtection.js');
// cache in-memory pour réduire les appels DB (config via variables d'environnement)
require('./utils/cache');


// middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} not allowed by CORS`), false);
  },
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
app.use('/api/session', sessionRouter);

// routes authentifiées
app.use('/api/enterprise', isAuthenticated, enterpriseRouter);
app.use('/api/analyst', isAuthenticated, analystRouter);
app.use('/api/kpi', isAuthenticated, kpiRouter);
app.use('/api/tickers', isAuthenticated, tickersRouter);
app.use('/api/tickersScore', isAuthenticated, tickersScoreRouter);
app.use('/api/marketOrders', isAuthenticated, marketOrdersRouter);
app.use('/api/marketTrades', isAuthenticated, marketTradesRouter);
app.use('/api/tickersExplore', isAuthenticated, tickersExplorerRouter);
app.use('/api/screener', isAuthenticated, screenerRouter);
app.use('/api/debug/cache', cacheDebugRouter);
app.use('/api/discord', discordRouter);

/**
 * Lancer le serveur
 */
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

// Le cache est initialisé automatiquement et peut être configuré via les variables d'environnement :
// CACHE_DEFAULT_TTL_MS et CACHE_CLEANUP_INTERVAL_MS
