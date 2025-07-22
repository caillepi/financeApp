
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

// initialisation des variables globales
let enterprise;
let analyst;
let periodAnalysed = Period.TWO_YEARS;
let ticker = 'AIR.PA';

async function initBourse(ticker, periodAnalysed) {
    let _enterprise = new Bourse(ticker, periodAnalysed);
    await _enterprise.init();
    let _analyst = new Analyst(_enterprise);

    return [_enterprise, _analyst];
}

(async () => {
    let resultInit = await initBourse(ticker, periodAnalysed);
    enterprise = resultInit[0];
    analyst = resultInit[1];

    app.use(cors());

    app.get('/', (req, res) => {
        res.send(analyst);
    });

    app.get('/enterprisename', (req, res) => {
        res.send(enterprise.name);
    });

    app.get('/current', (req, res) => {
        res.send(enterprise.current);
    });

    app.get('/low', (req, res) => {
        res.send(enterprise.low);
    });

    app.get('/high', (req, res) => {
        res.send(enterprise.high);
    });

    app.get('/min', (req, res) => {
        let data = analyst.getLowData();
        res.send(Math.min(...data));
    });

    app.get('/max', (req, res) => {
        let data = analyst.getHighData();
        res.send(Math.max(...data));
    });

    app.get('/mindata', (req, res) => {
        res.send(analyst.getLowData());
    });

    app.get('/maxdata', (req, res) => {
        res.send(analyst.getHighData());
    });

    app.get('/opendata', (req, res) => {
        res.send(analyst.getOpenData());
    });

    app.get('/closedata', (req, res) => {
        res.send(analyst.getCloseData());
    });

    app.get('/volumedata', (req, res) => {
        res.send(analyst.getVolumeData());
    });

    app.get('/date', (req, res) => {
        res.send(analyst.getDateData());
    });

    app.get('/mean', (req, res) => {
        res.send(analyst.getMean());
    });

    app.get('/sma_20', (req, res) => {
        res.send(analyst.getSMA(20));
    });

    app.get('/sma_50', (req, res) => {
        res.send(analyst.getSMA(50));
    });

    app.get('/sma_100', (req, res) => {
        res.send(analyst.getSMA(100));
    });

    app.get('/sma_200', (req, res) => {
        res.send(analyst.getSMA(200));
    });

    app.get('/macd', (req, res) => {
        res.send(analyst.getMACD());
    });

    app.get('/ema_12', (req, res) => {
        res.send(analyst.getEMA(12));
    });

    app.get('/ema_26', (req, res) => {
        res.send(analyst.getEMA(26));
    });

    app.get('/bollingerband', (req, res) => {
        res.send(analyst.getBollingerBand(20));
    })
    
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
})();  

