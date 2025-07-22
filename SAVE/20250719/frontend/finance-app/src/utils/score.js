/**
 * Fonction qui permet de calculer un score global à l'action en fonction des autres indicateurs
 * @param {String} code 
 */
export function computeScore(sma, macd, bollinger, rsi) {
    let ponderationSMA = 0.35;
    let ponderationMACD = 0.15;
    let ponderationBollinger = 0.25;
    let ponderationRSI = 0.25;

    return ponderationSMA * sma + 
            ponderationMACD * macd + 
            ponderationBollinger * bollinger +
            ponderationRSI * rsi;
}