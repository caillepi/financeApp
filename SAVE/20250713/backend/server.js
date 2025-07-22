
// variable d'environnement
require('dotenv').config()

// classes
const Period = require('./class/Period')
const Bourse = require('./class/Bourse')
const Analyst = require('./class/Analyst')

// intialisation de l'application express
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
var cors = require('cors');
const TickerReader = require('./class/TickerReader')
const Ticker = require('./class/Ticker')

// initialisation des variables globales
let periodAnalysed = Period.FIVE_YEARS;
let cachedEnterprise = null;
let cachedAnalyst = null;
let cachedTicker = null;
let tickerReader = new TickerReader();
tickerReader.init();

/**
 * Fonction qui permet de renvoyer l'objet Enterprise et Analyst correspondant à un Ticker
 * @param {String} ticker 
 * @returns <Enterprise>, <Analyst>
 */
async function getAnalystFromTicker(ticker) {
    if (cachedTicker === ticker && cachedEnterprise && cachedAnalyst) {
        return { enterprise: cachedEnterprise, analyst: cachedAnalyst };
    }

    const enterprise = new Bourse(ticker, periodAnalysed);
    await enterprise.init();
    const analyst = new Analyst(enterprise);

    cachedTicker = ticker;
    cachedEnterprise = enterprise;
    cachedAnalyst = analyst;

    return { enterprise, analyst };
}

/**
 * Fonction qui permet de renvoyer une fonction qui ajoute à la requête analyst et enterprise et qui traite les erreurs de ticker également
 * @param {function} handler 
 * @returns <function>
 */
function withTicker(handler) {
    return async (req, res) => {
        const { ticker } = req.query;
        if (!ticker) return res.status(400).json({ error: 'Ticker manquant' });

        try {
            const { enterprise, analyst } = await getAnalystFromTicker(ticker);
            await handler(req, res, enterprise, analyst);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}

// middleware
app.use(cors());

// routes
/**
 * Routes pour l'analyse des actions en bourse
 */
app.get('/', withTicker((req, res, _, analyst) => {
    res.send(analyst);
}));

/* Renvoie le nom de l'entreprise */
app.get('/enterprisename', withTicker((req, res, enterprise) => {
    res.send(enterprise.name)
}))

/* Renvoie le cours actuel de l'action */
app.get('/current', withTicker((req, res, enterprise) => {
    res.send(enterprise.current);
}));

/* Renvoie le minimum sur la dernière journée (ou journée en cours) */
app.get('/low', withTicker((req, res, enterprise) => {
    res.send(enterprise.low);
}));

/* Renvoie le maximum sur la dernière journée (ou journée en cours) */
app.get('/high', withTicker((req, res, enterprise) => {
    res.send(enterprise.high);
}));

/* Renvoie le minimum sur une période donnée (minimum parmi les minimums) */
app.get('/min', withTicker((req, res, _, analyst) => {
    const { period } = req.query;
    let data = analyst.getLowData(period);
    res.send(Math.min(...data));
}));

/* Renvoie le maximum sur une période donnée (maximum parmi les maximums) */
app.get('/max', withTicker((req, res, _, analyst) => {
    const { period } = req.query;
    let data = analyst.getHighData(period);
    res.send(Math.max(...data));
}));

/* Renvoie la liste de tous les minimums sur une période par défaut */
app.get('/mindata', withTicker((req, res, _, analyst) => {
    const { period } = req.query;
    res.send(analyst.getLowData(period));
}));

/* Renvoie la liste de tous les maximums sur une période par défaut */
app.get('/maxdata', withTicker((req, res, _, analyst) => {
    const { period } = req.query;
    res.send(analyst.getHighData(period));
}));

/* Renvoie les cours d'ouverture sur la période par défaut */
app.get('/opendata', withTicker((req, res, _, analyst) => {
    res.send(analyst.getOpenData());
}));

/* Renvoie les cours de fermeture sur la période par défaut */
app.get('/closedata', withTicker((req, res, _, analyst) => {
    res.send(analyst.getCloseData());
}));

/* Renvoie les volumes échangés sur la période par défaut */
app.get('/volumedata', withTicker((req, res, _, analyst) => {
    res.send(analyst.getVolumeData());
}));

/* Renvoie les dates de la période par défaut */
app.get('/date', withTicker((req, res, _, analyst) => {
    res.send(analyst.getDateData());
}));

/* Renvoie la moyenne des cours de cloture sur la période par défaut */
app.get('/mean', withTicker((req, res, _, analyst) => {
    const { period } = req.query;
    res.send(analyst.getMean(period));
}));

app.get('/rsi', withTicker((req, res, _, analyst) => {
    res.send(analyst.getRSI());
}));

/* Renvoie la liste des SMA sur une période de 20 */
app.get('/sma_20', withTicker((req, res, _, analyst) => {
    res.send(analyst.getSMA(20));
}));

/* Renvoie la liste des SMA sur une période de 50 */
app.get('/sma_50', withTicker((req, res, _, analyst) => {
    res.send(analyst.getSMA(50));
}));

/* Renvoie la liste des SMA sur une période de 100 */
app.get('/sma_100', withTicker((req, res, _, analyst) => {
    res.send(analyst.getSMA(100));
}));

/* Renvoie la liste des SMA sur une période de 200 */
app.get('/sma_200', withTicker((req, res, _, analyst) => {
    res.send(analyst.getSMA(200));
}));

/* Renvoie la liste des MACD sur la période par défaut */
app.get('/macd', withTicker((req, res, _, analyst) => {
    res.send(analyst.getMACD());
}));

/* Renvoie la liste des EMA sur une période de 12 */
app.get('/ema_12', withTicker((req, res, _, analyst) => {
    res.send(analyst.getEMA(12));
}));

/* Renvoie la liste des EMA sur une période de 26 */
app.get('/ema_26', withTicker((req, res, _, analyst) => {
    res.send(analyst.getEMA(26));
}));

/* Renvoie la liste des EMA sur une période de 20 */
app.get('/bollingerband', withTicker((req, res, _, analyst) => {
    res.send(analyst.getBollingerBand(20));
}));

/**
 * Récupérer les KPIs
 */
app.get('/kpiclose', withTicker((req, res, _, analyst) => {
    res.send(analyst.getKpiSma());
}));

app.get('/kpibollinger', withTicker((req, res, _, analyst) => {
    res.send(analyst.getKpiBollinger());
}));

app.get('/kpimacd', withTicker((req, res, _, analyst) => {
    res.send(analyst.getKpiMacd());
}));

app.get('/kpirsi', withTicker((req, res, _, analyst) => {
    res.send(analyst.getKpiRsi());
}));

/**
 * Interactions avec tickers.csv
 */
app.get('/tickers', async (req, res) => {
    try {       
        // Convertir les instances de Ticker en objets simples
        const tickersData = tickerReader.convertCsvToJson();

        // Envoyer les données en format JSON
        res.json(tickersData);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la lecture du fichier CSV');
    }
})

app.get('/addTicker', async (req, res) => {
    const { name, code, isActive } = req.query;
    let newTicker = new Ticker(name, code, isActive);
    tickerReader.addTicker(newTicker);
    res.send("Element correctement ajouté");
})

app.get('/removeticker', async (req, res) => {
    const { code } = req.query;
    tickerReader.removeTicker(code);
    res.send("Element correctement supprimé");
})

app.get('/updateTicker', async (req, res) => {
    const { code, isActive } = req.query;
    tickerReader.updateTicker(code, isActive);
    res.send("Element correctement mis à jour");
})

/**
 * Lancer le serveur
 */
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
