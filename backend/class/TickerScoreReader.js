const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const csvWriter = require('csv-write-stream'); // pour écrire dans un fichier CSV
const TickerScore = require('./TickerScore'); // Assurez-vous que le chemin est correct

class TickerScoreReader {
    constructor() {
        this.tickersScore = []; // Tableau d'objets de type TickerScore
    }

    getTickerScore() {
        return this.tickersScore;
    }

    setTickerScore(tickers) {
        this.tickersScore = tickers; 
    }

    /**
     * Ajoute un élément de type <TickerScore> au tableau tickers
     * @param {<TickerScore>} ticker 
     */
    addTickerScore(tickerScore) {
        this.tickersScore.push(tickerScore);
        this.updateCSV();
    }

    /**
     * Enlève un élément de type <TickerScore> au tableau tickers
     * @param {String} code Code d'un tickerScore
     * @param {String} day Jour auquel le tickerScore a été enregistré
     */
    removeTickerScore(code, day) {
        if (day === null) {
            this.tickersScore = this.tickersScore.filter(tickerScore => tickerScore.getCode() !== code);
        }
        else {
            this.tickersScore = this.tickersScore.filter((tickerScore) => {
                if (tickerScore.getCode() !== code) {
                    return true;
                }
                else {
                    if (tickerScore.getDay() != day) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            });
        }
        this.updateCSV();
    }

    /**
     * Mettre à jour le fichier CSV en fonction de l'attribut 
     */
    updateCSV() {
        const filePath = path.join(__dirname, '..', 'data', 'tickersScore.csv');
        const writer = csvWriter({ headers: ['day', 'code', 'mm', 'macd', 'bollinger', 'rsi', 'score'] });
        
        writer.pipe(fs.createWriteStream(filePath));
        
        this.tickersScore.forEach(tickerScore => {
            writer.write({
                day: tickerScore.getDay(),
                code: tickerScore.getCode(),
                mm: tickerScore.getMm(),
                macd: tickerScore.getMacd(),
                bollinger: tickerScore.getBollinger(),
                rsi: tickerScore.getRsi(),
                score: tickerScore.getScore()
            });
        });

        writer.end();
    }

    /**
     * Convertir le fichier CSV en JSON pour qu'il soit utilisable par le front-end
     */
    convertCsvToJson() {
        const tickersScoreData = this.getTickerScore().map(tickerScore => ({
            day: tickerScore.getDay(),
            code: tickerScore.getCode(),
            mm: tickerScore.getMm(),
            macd: tickerScore.getMacd(),
            bollinger: tickerScore.getBollinger(),
            rsi: tickerScore.getRsi(),
            score: tickerScore.getScore()
        }));
        return tickersScoreData;
    }

    /**
     * Fonction asynchrone qui initialise les tickersScore à partir d'un fichier CSV.
     * Le fichier CSV est situé à ./data/tickersScore.csv
     */
    async init() {
        const filePath = path.join(__dirname, '..', 'data', 'tickersScore.csv');

        // Vérification si le fichier existe
        if (!fs.existsSync(filePath)) {
            throw new Error('Le fichier tickersScore.csv est introuvable.');
        }

        const tickersScore = [];
        
        return new Promise((resolve, reject) => {
            // Lecture et parsing du fichier CSV
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    const tickerScore = new TickerScore(row.day, row.code, row.mm, row.macd, row.bollinger, row.score);
                    tickersScore.push(tickerScore);
                })
                .on('end', () => {
                    this.setTickerScore(tickersScore); // Mise à jour du tableau tickers
                    resolve(); // Résolution de la Promise après avoir chargé les données
                })
                .on('error', (err) => {
                    reject(new Error('Erreur lors de la lecture du fichier CSV : ' + err.message));
                });
        });
    }
}

module.exports = TickerScoreReader;