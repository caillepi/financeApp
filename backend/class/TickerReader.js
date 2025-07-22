const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const csvWriter = require('csv-write-stream'); // pour écrire dans un fichier CSV
const Ticker = require('./Ticker'); // Assurez-vous que le chemin est correct

class TickerReader {
    constructor() {
        this.tickers = []; // Tableau d'objets de type Ticker
    }

    getTickers() {
        return this.tickers;
    }

    setTickers(tickers) {
        this.tickers = tickers; 
    }

    /**
     * Ajoute un élément de type <Ticker> au tableau tickers
     * @param {Ticker} ticker 
     */
    addTicker(ticker) {
        this.tickers.push(ticker);
        this.updateCSV();
    }

    /**
     * Enlève un élément de type <Ticker> au tableau tickers
     * @param {String} code Code d'un ticker
     */
    removeTicker(code) {
        this.tickers = this.tickers.filter(ticker => ticker.getCode() !== code);
        this.updateCSV();
    }

    /**
     * Met à jour un élement de type <Ticker> au tableau tickers
     * Seul la propriété actif peut être mise à jour
     * @param {String} code Code d'un ticker
     */
    updateTicker(code, isActiveUpdated) {
        this.tickers = this.tickers.map((ticker) => {
            if (ticker.getCode() == code) {
                ticker.setIsActive(Number(isActiveUpdated));
                return ticker;
            }
            else {
                return ticker;
            }
        });
        this.updateCSV();
    }

    /**
     * Mettre à jour le fichier CSV en fonction de l'attribut 
     */
    updateCSV() {
        const filePath = path.join(__dirname, '..', 'data', 'tickers.csv');
        const writer = csvWriter({ headers: ['name', 'code', 'isActive'] });
        
        writer.pipe(fs.createWriteStream(filePath));
        
        this.tickers.forEach(ticker => {
            writer.write({
                name: ticker.getName(),
                code: ticker.getCode(),
                isActive: ticker.getIsActive()
            });
        });

        writer.end();
    }

    /**
     * Convertir le fichier CSV en JSON pour qu'il soit utilisable par le front-end
     */
    convertCsvToJson() {
        const tickersData = this.getTickers().map(ticker => ({
            name: ticker.getName(),
            code: ticker.getCode(),
            isActive: ticker.getIsActive()
        }));
        return tickersData;
    }

    /**
     * Fonction asynchrone qui initialise les tickers à partir d'un fichier CSV.
     * Le fichier CSV est situé à ./data/tickers.csv
     */
    async init() {
        const filePath = path.join(__dirname, '..', 'data', 'tickers.csv');

        // Vérification si le fichier existe
        if (!fs.existsSync(filePath)) {
            throw new Error('Le fichier tickers.csv est introuvable.');
        }

        const tickers = [];
        
        return new Promise((resolve, reject) => {
            // Lecture et parsing du fichier CSV
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    const ticker = new Ticker(row.name, row.code, parseInt(row.isActive));
                    tickers.push(ticker);
                })
                .on('end', () => {
                    this.setTickers(tickers); // Mise à jour du tableau tickers
                    resolve(); // Résolution de la Promise après avoir chargé les données
                })
                .on('error', (err) => {
                    reject(new Error('Erreur lors de la lecture du fichier CSV : ' + err.message));
                });
        });
    }
}

module.exports = TickerReader;