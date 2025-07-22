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

    /**
     * Calcule les cours d'ouverture sur une période donnée
     * @returns {Array} - Liste des cours d'ouverture
     */
    getOpenData() {
        let result = [];
        this.enterprise.history.forEach(element => {
            result.push(element.open);
        });
        return result;
    }

    /**
     * Calcule les cours de cloture sur une période donnée
     * @returns {Array} - Liste des cours de cloture
     */
    getCloseData() {
        let result = [];
        this.enterprise.history.forEach(element => {
            result.push(element.close);
        });
        return result;
    }

    /**
     * Calcule les volumes engagés chaque jour de bourse
     * @returns {Array} - Liste des volumes journaliers
     */
    getVolumeData() {
        let result = [];
        this.enterprise.history.forEach(element => {
            result.push(element.volume);
        });
        return result;
    }

    /**
     * Calcule les cours baissiers journaliers
     * @returns {Array} - Liste des cours bas journaliers
     */
    getLowData() {
        let result = [];
        this.enterprise.history.forEach(element => {
            result.push(element.low);
        });
        return result;
    }

    /**
     * Calcule les cours haussiers journaliers
     * @returns {Array} - Liste des cours hauts journaliers
     */
    getHighData() {
        let result = [];
        this.enterprise.history.forEach(element => {
          result.push(element.high);
        });
        return result;
    }
  
    /**
     * Calcule la moyenne des données de clotures
     * @returns {number} - Moyenne des données
     */
    getMean() {
      let result = 0;
      let length = 0;
      this.enterprise.history.forEach(element => {
        result += element.close;
        length += 1;
      });
      return result / length;
    }

    /**
     * Calcule la moyenne des données de clotures
     * @param {Array} _data - Données à analyser
     * @returns {number} - Moyenne des données
     */
    getMeanFromArray(_data) {
      let result = 0;
      let length = 0;
      _data.forEach(element => {
        result += element;
        length += 1;
      });
      return result / length;
    }
  
    /**
     * Calcule la moyenne mobile simple
     * @param {number} period - Période pour la moyenne mobile simple
     * @returns {Array} - Moyenne mobile simple
     */
    getSMA(period) {
      // initialisation du tableau
      let result = [];

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
  
    /**
     * Calcule la moyenne mobile exponentielle a partir d'une liste donnee en parametre
     * @param {Array} dataArray - Tableau sur lequel calculer l'EMA
     * @param {number} period - Période pour la moyenne mobile exponentielle
     * @returns {Array} Moyenne mobile exponentielle
     */
    getEMAFromArray(dataArray, period = 14) {
      const multiplier = 2 / (period + 1);
      const result = [];

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

      for (let i = 1; i < this.closeData.length; i++) {
        deltaList.push(this.closeData[i] - this.closeData[i - 1]);
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
      let stddev = []

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
}

module.exports = Analyst;