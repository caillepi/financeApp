import axios from 'axios';

function addTicker(ticker) {
    return "?ticker=" + ticker;
}

// Fonction générique pour les appels GET avec gestion des erreurs
async function fetchData(endpoint, ticker) {
    try {
        const url = import.meta.env.VITE_API_URL + endpoint + addTicker(ticker);
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.log(err.response?.data);
        return null;
    }
}

// Fonctions spécifiques qui appellent fetchData
export async function getEnterpriseName(ticker) {
  return fetchData('/enterprisename', ticker);
}

export async function getCurrent(ticker) {
  return fetchData('/current', ticker);
}

export async function getLow(ticker) {
  return fetchData('/low', ticker);
}

export async function getHigh(ticker) {
  return fetchData('/high', ticker);
}

export async function getLastOpen(ticker) {
  const data = await fetchData('/opendata', ticker);
  return data ? parseFloat(data[data.length - 1].toFixed(2)) : null;
}

export async function getOpenData(ticker) {
  return fetchData('/opendata', ticker);
}

export async function getLastClose(ticker) {
  const data = await fetchData('/closedata', ticker);
  return data ? parseFloat(data[data.length - 2].toFixed(2)) : null;
}

export async function getCloseData(ticker) {
  return fetchData('/closedata', ticker);
}

export async function getVolumeData(ticker) {
  return fetchData('/volumedata', ticker);
}

export async function getMinData(ticker) {
  return fetchData('/mindata', ticker);
}

export async function getMaxData(ticker) {
  return fetchData('/maxdata', ticker);
}

export async function getMin(ticker) {
  return fetchData('/min', ticker);
}

export async function getMax(ticker) {
  return fetchData('/max', ticker);
}

export async function getDateData(ticker) {
  return fetchData('/date', ticker);
}

export async function getMean(ticker) {
  return fetchData('/mean', ticker);
}

export async function getSMA(period, ticker) {
  return fetchData(`/sma_${period}`, ticker);
}

export async function getMACD(ticker) {
  return fetchData('/macd', ticker);
}

export async function getEMA(period, ticker) {
  return fetchData(`/ema_${period}`, ticker);
}

export async function getBollingerBand(ticker) {
  return fetchData('/bollingerband', ticker);
}