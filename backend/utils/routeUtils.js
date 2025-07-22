const Period = require("../class/Period");
const Bourse = require('../class/Bourse');
const Analyst = require('../class/Analyst');

// initialisation des variables globales
let periodAnalysed = Period.FIVE_YEARS;
let cachedEnterprise = null;
let cachedAnalyst = null;
let cachedTicker = null;

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
 * @param {function} handler Fonction de contrôle serveur
 * @returns <function> Fonction de contrôle pour le serveur avec les objets d'analyse pour le ticker
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

module.exports = {
    withTicker
}