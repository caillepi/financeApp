const { DateTime } = require("luxon");

class Analyst {
    /**
     * Classe pour analyser le cours de la bourse
     * @param {Bourse} enterprise - Données du cours de la bourse
     * @param {Integer} PRECISION_COMPUTATION - Précision souhaitée sur les données receuillie 
     */
    constructor(enterprise) {
        this.enterprise = enterprise;
        this.PRECISION_COMPUTATION = 2; 
    }

    /**
     * Calcule les dates sur lesquelles l'étude s'effectue 
     * @returns {Array} - Liste des dates de l'étude
     */
    getDateData() {
        let result = [];
        try {
          if (this.enterprise.history === 'N/A') {
            return 'N/A';
          }
          else {
            this.enterprise.history.forEach(element => {
                const date = new Date(element.date);
                // Extract the year, month, and day
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                const day = String(date.getDate()).padStart(2, '0');
                result.push(`${year}-${month}-${day}`);
            });
            return result;
          }
        }
        catch (error) {
            console.error(`Error fetching date data ${this.enterprise.ticker}`);
            return null;
        }
    }

    /**
     * Calcule les cours d'ouverture sur une période donnée
     * @returns {Array} - Liste des cours d'ouverture
     */
    getOpenData() {
      let result = [];
      try {
        if (this.enterprise.history === 'N/A') {
          return 'N/A';
        }
        this.enterprise.history.forEach(element => {
            result.push(element.open);
        });
        return result;
      }
      catch (error) {
        console.error(`Error fetching open data ${this.enterprise.ticker}`);
        return null;
      }
    }

    /**
     * Calcule les cours de cloture sur une période donnée
     * @returns {Array} - Liste des cours de cloture
     */
    getCloseData() {
        let result = [];
        
        try {
          if (this.enterprise.history === 'N/A') {
            return 'N/A';
          }
          this.enterprise.history.forEach(element => {
              result.push(element.close);
          });
          return result;
        }
        catch (error) {
          console.error(`Error fetching close data ${this.enterprise.ticker}`);
          return null;
        }
    }

    /**
     * Calcule les volumes engagés chaque jour de bourse
     * @returns {Array} - Liste des volumes journaliers
     */
    getVolumeData() {
        let result = [];
        try {
          if (this.enterprise.history == null) {
            return 'N/A';
          }
          this.enterprise.history.forEach(element => {
              result.push(element.volume);
          });
          return result;
        }
        catch (error) {
          console.error(`Error fetching volume data ${this.enterprise.ticker}`);
          return null;
        }
    }

    /**
     * Calcule les cours baissiers journaliers
     * @param {String} period - Période d'analyse
     * @returns {Array} - Liste des cours bas journaliers sur la période en paramètre
     */
    getLowData(period) {
        let result = [];
        try {
          if (this.enterprise.history == null) {
            return 'N/A';
          }
          const now = DateTime.now();
          let startDate = null;
          if (period == 'ONE_WEEK') startDate = now.minus({ weeks: 1 });
          else if (period == 'ONE_MONTH') startDate = now.minus({ months: 1 });
          else if (period == 'SIX_MONTHS') startDate = now.minus({ months: 6 });
          else if (period == 'ONE_YEAR') startDate = now.minus({ years: 1 });
          else if (period == 'TWO_YEARS') startDate = now.minus({ years: 2 });
          else if (period == 'FIVE_YEARS') startDate = now.minus({ years: 5 });
          else startDate = null;
          this.enterprise.history.forEach((element) => {
            if (element.date >= startDate.ts) {
              result.push(element.low);
            }
          });
          return result;
        }
        catch (error) {
          console.error(`Error fetching low data (${this.enterprise.ticker})`);
          return null;
        }

    }

    /**
     * Calcule les cours haussiers journaliers
     * @param {String} period - Période d'analyse
     * @returns {Array} - Liste des cours hauts journaliers
     */
    getHighData(period) {
      let result = [];
      try {
        if (this.enterprise.history == null) {
          return 'N/A';
        }
        
        const now = DateTime.now();
        let startDate = null;

        if (period == 'ONE_WEEK') startDate = now.minus({ weeks: 1 });
        else if (period == 'ONE_MONTH') startDate = now.minus({ months: 1 });
        else if (period == 'SIX_MONTHS') startDate = now.minus({ months: 6 });
        else if (period == 'ONE_YEAR') startDate = now.minus({ years: 1 });
        else if (period == 'TWO_YEARS') startDate = now.minus({ years: 2 });
        else if (period == 'FIVE_YEARS') startDate = now.minus({ years: 5 });
        else startDate = null;

        this.enterprise.history.forEach(element => {
          if (element.date >= startDate.ts) {
            result.push(element.high);
          }
        });
        
        return result;
      }
      catch (error) {
        console.error(`Error fetching high data (${this.enterprise.ticker})`);
        return null;
      }
    }
  
    /**
     * Calcule la moyenne des données de clotures
     * @param {String} period - Période d'analyse
     * @returns {number} - Moyenne des données
     */
    getMean(period) {
      let result = 0;
      let length = 0;
      try {
          if (this.enterprise.history == null) {
            return 'N/A';
          }

          const now = DateTime.now();
          let startDate = null;
    
          if (period == 'ONE_WEEK') startDate = now.minus({ weeks: 1 });
          else if (period == 'ONE_MONTH') startDate = now.minus({ months: 1 });
          else if (period == 'SIX_MONTHS') startDate = now.minus({ months: 6 });
          else if (period == 'ONE_YEAR') startDate = now.minus({ years: 1 });
          else if (period == 'TWO_YEARS') startDate = now.minus({ years: 2 });
          else if (period == 'FIVE_YEARS') startDate = now.minus({ years: 5 });
          else startDate = null;
    
          this.enterprise.history.forEach(element => {
            if (element.date > startDate) {
              result += element.close;
              length += 1;
            }
          });

          return result / length;
        }
        catch (error) {
          console.error(`Error fetching mean data (${this.enterprise.ticker})`);
          return null;
        }

    }

    /**
     * Calcule la moyenne des données de clotures
     * @param {Array} _data - Données à analyser
     * @returns {number} - Moyenne des données
     */
    getMeanFromArray(_data) {
      let result = 0;
      let length = 0;
      try {
        if (_data == null) {
          console.error(`Error fetching mean from array : array is empty`);
          return null;
        }
        _data.forEach(element => {
          result += element;
          length += 1;
        });
        return result / length;
      }
      catch (error) {
        console.error(`Error fetching mean from array : ` + error.message);
        return null;
      }
    }
  
    /**
     * Calcule la moyenne mobile simple
     * @param {number} period - Période pour la moyenne mobile simple
     * @returns {Array} - Moyenne mobile simple
     */
    getSMA(period) {
      // initialisation du tableau
      let result = [];

      try {
          if (this.enterprise.history == 'N/A') {
            return 'N/A';
          }
          // je parcours tous les elements du tableau
          this.enterprise.history.forEach((element, index, arr) => {
            // si mon index est plus petit que ma periode alors je renvoie null car sma pas defini
            if (index < period) {
              result.push(null);
            }
            // sinon je peux calculer une sma
            else {
              // je recupere les elements qui m'interesse
              const slice = arr.slice(index - period, index);
              let sum = 0;
              // je fais la somme de tous les elements
              slice.forEach((element) => {
                sum += element.close
              });
              // je renvoie la somme divisee par la periode
              result.push(parseFloat((sum / period).toFixed(this.PRECISION_COMPUTATION)));
            }
          });
          return result;
        }
        catch (error) {
          console.error(`Error fetching SMA data (${this.enterprise.ticker})`);
          return null;
        }
    }
  
    /**
     * Calcule la moyenne mobile exponentielle
     * @param {number} period - Période pour la moyenne mobile exponentielle
     * @returns {Array} - Moyenne mobile exponentielle
     */
    getEMA(period = 14) {
      // definition du multiplicateur
      const multiplier = 2 / (period + 1);
      // initialisation du tableau
      const result = [];

      try {
        if (this.enterprise.history === 'N/A') {
          return 'N/A';
        }
        
        // Vérification : pas assez de données
        if (this.enterprise.history.length < period) {
          return Array(this.enterprise.history.length).fill(null);
        }
  
        // Calcul de la SMA initiale (base de départ de l’EMA)
        let sma = null;
        for (let i = 0; i < period; i++) {
          sma += this.enterprise.history[i].close;
        }
        sma = sma / period;
  
        // Remplir les premiers éléments avec null pour garder l’alignement
        for (let i = 0; i < period - 1; i++) {
          result.push(null);
        }
  
        // Premier point de l’EMA = SMA
        let ema = parseFloat(sma.toFixed(this.PRECISION_COMPUTATION));
        result.push(ema);
  
        // Calcul de l’EMA pour les points suivants
        for (let i = period; i < this.enterprise.history.length; i++) {
            ema = (this.enterprise.history[i].close - ema) * multiplier + ema;
            result.push(parseFloat(ema.toFixed(this.PRECISION_COMPUTATION)));
        }
  
        return result;
      }
      catch (error) {
        console.error(`Error fetching EMA (${this.enterprise.ticker}) `);
        return null;
      }

    }
  
    /**
     * Calcule la moyenne mobile exponentielle a partir d'une liste donnee en parametre
     * @param {Array} dataArray - Tableau sur lequel calculer l'EMA
     * @param {number} period - Période pour la moyenne mobile exponentielle
     * @returns {Array} Moyenne mobile exponentielle
     */
    getEMAFromArray(dataArray, period = 14) {
      const multiplier = 2 / (period + 1);
      const result = [];

      if (dataArray == null) {
        return null;
      }

      // Vérification : pas assez de données
      if (dataArray.length < period) {
          return Array(dataArray.length).fill(null);
      }

      // Calcul de la SMA initiale (base de départ de l’EMA)
      const initialSlice = dataArray.slice(0, period);
      const sma = initialSlice.reduce((sum, val) => sum + val, 0) / period;

      // Remplir les premiers éléments avec null pour garder l’alignement
      for (let i = 0; i < period - 1; i++) {
          result.push(null);
      }

      // Premier point de l’EMA = SMA
      let ema = parseFloat(sma.toFixed(this.PRECISION_COMPUTATION));
      result.push(ema);

      // Calcul de l’EMA pour les points suivants
      for (let i = period; i < dataArray.length; i++) {
          ema = (dataArray[i] - ema) * multiplier + ema;
          result.push(parseFloat(ema.toFixed(this.PRECISION_COMPUTATION)));
      }

      return result;
    }

    /**
     * Calcule le maximum des données
     * @param {Array} _data - Données à analyser
     * @returns {number} - Maximum des données
     */
    getMax(_data) {
      return parseFloat(Math.max(..._data).toFixed(this.PRECISION_COMPUTATION));
    }
  
    /**
     * Calcule le minimum des données
     * @param {Array} _data - Données à analyser
     * @returns {number} - Minimum des données
     */
    getMin(_data) {
      return parseFloat(Math.min(..._data).toFixed(this.PRECISION_COMPUTATION));
    }
  
    /**
     * Calcule l'écart type des données
     * @param {Array} _data - Données à analyser
     * @returns {number} - Écart type des données
     */
    getStdDev(_data) {
      if (_data == null) {
        return null;
      }

      const mean = this.getMeanFromArray(_data);
      const squaredDiffs = _data.map(x => Math.pow(x - mean, 2));
      const variance = squaredDiffs.reduce((a, b) => a + b, 0) / _data.length;
      return parseFloat(Math.sqrt(variance).toFixed(this.PRECISION_COMPUTATION));
    }
  
    /**
     * Calcule l'indice de force relative (RSI)
     * @returns {Array} - Indice de force relative
     */
    getRSI() {
      let rsi = [];
      const parameter = 14;
      let deltaList = [];

      deltaList.push(null);

      let closeData = this.getCloseData();

      if (closeData === 'N/A') {
        return 'N/A';
      }

      for (let i = 1; i < closeData.length; i++) {
        deltaList.push(closeData[i] - closeData[i - 1]);
      }
  
      let gainList = deltaList.map((delta) => {
        if (delta > 0) {
          return delta;
        }
        else {
          return 0;
        }
      });

      let lossList = deltaList.map((delta) => {
        if (delta < 0) {
          return - delta;
        }
        else {
          return 0;
        }
      });
  
      let averageGain = [];
      let averageLoss = [];

      for (let i = 0; i < deltaList.length; i++) {
        if (i < parameter) {
          averageGain.push(null);
          averageLoss.push(null);
        } else {
          const gainSlice = gainList.slice(i - parameter, i);
          const lossSlice = lossList.slice(i - parameter, i);
          const avgGain = gainSlice.reduce((a, b) => a + b, 0) / parameter;
          const avgLoss = lossSlice.reduce((a, b) => a + b, 0) / parameter;
          averageGain.push(avgGain);
          averageLoss.push(avgLoss);
        }
      }
  
      let rsList = [];
      for (let i = 0; i < averageGain.length; i++) {
        if (averageGain[i] === null || averageLoss[i] === null) {
          rsList.push(null);
        } else {
          rsList.push(averageLoss[i] / averageGain[i]);
        }
      }
  
      for (let i = 0; i < rsList.length; i++) {
        if (rsList[i] === null) {
          rsi.push(null);
        } else {
          rsi.push(100 - 100 / (1 + rsList[i]));
        }
      }
  
      return rsi;
    }

    /**
     * Calcule l'indicateur MACD - Moving Average Convergence Divergence
     * @returns {[{Array}, {Array}]} - Deux listes : une pour le MACD, une pour la ligne de signal 
     */
    getMACD() {
      let ema12 = this.getEMA(12);
      let ema26 = this.getEMA(26);

      if (ema12 == 'N/A' || ema26 == 'N/A') {
        return 'N/A';
      }

      let macd = ema12.map((val, idx) => {
        if (val !== null && ema26[idx] !== null) {
          return val - ema26[idx]
        }
        return null;
      });

      let signal = this.getEMAFromArray(macd, 9);
      return [macd, signal];
    }

    /**
     * Calcule les informations sur les bandes de Bollinger
     * @param {Integer} period - période surlaquelle les bandes sont calculées
     * @returns {[{Array}, {Array}]} - une liste pour la SMA et une liste pour les ecarts-types de chaque SMA
     */
    getBollingerBand(period = 20) {
      let sma = this.getSMA(period);
      let stddev = [];

      if (sma == 'N/A') {
        return 'N/A';
      }

      for (let i = 0; i < this.enterprise.history.length; i++) {
        if (i < period) {
          stddev.push(null);
        }
        else {
          const window = this.enterprise.history.slice(i - period, i).map(item => item.close);
          stddev.push(this.getStdDev(window));
        }
      }

      return [sma, stddev]
    }

    /**
     * Sort un indicateur en pourcentage pour l'**achat**.
     * Si 0% alors il ne faut surtout pas acheter (et donc il faut vendre)
     * Si 100% alors il faut plutôt acheter (et donc il ne faut surtout pas vendre)
     */
    getKpiSma() {
      let sma_20 = this.getSMA(20);
      let sma_50 = this.getSMA(50);
      let sma_100 = this.getSMA(100);
      let sma_200 = this.getSMA(200);

      if (sma_20 == 'N/A' || sma_50 == 'N/A' || sma_100 == 'N/A' || sma_200 == 'N/A') {
        return 'N/A';
      }

      sma_20 = sma_20.at(-1);
      sma_50 = sma_50.at(-1);
      sma_100 = sma_100.at(-1);
      sma_200 = sma_200.at(-1);

      let score = 0;
      let maxScore = 100;

      // Pondération des signaux
      const signals = [
        { condition: sma_20 > sma_200, weight: 30 },
        { condition: sma_50 > sma_200, weight: 20 },
        { condition: sma_100 > sma_200, weight: 15 },
        { condition: sma_20 > sma_50, weight: 15 },
        { condition: sma_20 > sma_100, weight: 10 },
        { condition: sma_50 > sma_100, weight: 10 }
      ];

      // Calcul du score brut (positif ou négatif)
      for (let s of signals) {
        if (s.condition) {
          score += s.weight;
        } else {
          score -= s.weight;
        }
      }

      // Convertir en pourcentage entre 0 et 100
      let percent = (score + maxScore) / (2 * maxScore) * 100;

      // Clamp entre 0 et 100
      percent = Math.max(0, Math.min(100, percent));

      return percent;
    }

    /**
     * Sort un indicateur sur les bandes de Bollinger
     * 100 -> clôture à 1,5% en dessous des bandes de Bollinger                                             => acheter
     * 75 -> clôture entre 1,5% en dessous des bandes de Bollinger et -1 écart-type par rapport à la SMA
     * 50 -> clôture à plus/moins 1 écart-type par rapport à la SMA
     * 25 -> clôture entre 1,5% au-dessus des bandes de Bollinger et +1 écart-type par rapport à la SMA
     * 0 -> clôture à 1,5% au dessous des bandes de Bollinger                                           => vendre
     */
    getKpiBollinger() {
      // resultat des bandes de Bollinger
      let data = this.getBollingerBand();

      if (data == 'N/A') {
        return 'N/A';
      }

      let sma = data[0].at(-1);
      let stddev = data[1].at(-1);

      // resultat de la clôture de la veille
      let close = this.getCloseData().at(-1);

      // mise en place de l'indicateur
      let result = 50;

      if (close < ((sma - 2*stddev) * (1 - 0.015))) result = 100
      else if (close > ((sma - 2*stddev) * (1 - 0.015)) && close < (sma - stddev)) result = 75
      else if (close > (sma - stddev) && close < (sma + stddev)) result = 50
      else if (close > (sma + stddev) && close < ((sma + 2*stddev) * (1 + 0.015))) result = 25
      else if (close > (sma + 2*stddev) * (1 + 0.015)) result = 0

      return result;
    }

    /**
     * Sort un indicateur sur le MACD
     * 0 -> Histogramme négatif et MACD négatif
     * 25 -> Histogramme négatif et MACD positif
     * 50 -> Histogramme proche de zero. 
     * /!\ Attention tout de même, pas tout à fait exact. Si MACD fortement positif et histo presque nul peut indiquer une forte hausse également 
     * 75 -> Histogramme positif et MACD négatif
     * 100 -> Histogramme positif et MACD positif
     */
    getKpiMacd() {
      let result = 0;

      // récupérer les données
      let data = this.getMACD();

      if (data == 'N/A') {
        return null;
      }

      let macd = data[0].at(-1);    // valeur MACD
      let signal = data[1].at(-1);  // valeur signal

      let histo = macd - signal;    // valeur de l'histogramme

      if (histo < 0 && macd < 0) result = 0
      else if (histo < 0 && macd > 0) result = 25
      else if (histo > 0 && macd < 0) result = 75
      else if (histo > 0 && macd > 0) result = 100

      // Si l'histogramme est proche de zéro (histo < 10% de la valeur de MACD)
      if (Math.abs(histo) < (0.20 * Math.abs(macd))) {
        result = 50; // Histogramme proche de zéro, attribuer la valeur 50
      }

      return result;
    }

    /**
     * Sort un indicateur sur le RSI (prend simplement le dernier RSI)
     * Directement entre 0 et 100
     */
    getKpiRsi() {
      let data = this.getRSI();

      if (data == 'N/A') {
        return null;
      }

      return data.at(-1);
    }
}

module.exports = Analyst;