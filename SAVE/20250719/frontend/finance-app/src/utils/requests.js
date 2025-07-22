import axios from 'axios';

// Fonction générique pour les appels GET avec gestion des erreurs
async function fetchData(endpoint, ticker) {
    try {
        const url = import.meta.env.VITE_API_URL + endpoint;
        const response = await axios.get(url, {params: {ticker}});
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

export async function getSector(ticker) {
  return fetchData('/sector', ticker);
}

export async function getDescription(ticker) {
  return fetchData('/description', ticker);
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

export async function getMinData(ticker, period) {
  try {
      const url = import.meta.env.VITE_API_URL + '/mindata';
      const response = await axios.get(url, {params: {ticker, period}});
      return response.data;
  } catch (err) {
      console.log(err.response?.data);
      return null;
  }
}

export async function getMaxData(ticker, period) {
  try {
      const url = import.meta.env.VITE_API_URL + '/maxdata';
      const response = await axios.get(url, {params: {ticker, period}});
      return response.data;
  } catch (err) {
      console.log(err.response?.data);
      return null;
  }
}

export async function getMin(ticker, period) {
  try {
      const url = import.meta.env.VITE_API_URL + '/min';
      const response = await axios.get(url, {params: {ticker, period}});
      return response.data;
  } catch (err) {
      console.log(err.response?.data);
      return null;
  }
}

export async function getMax(ticker, period) {
  try {
      const url = import.meta.env.VITE_API_URL + '/max';
      const response = await axios.get(url, {params: {ticker, period}});
      return response.data;
  } catch (err) {
      console.log(err.response?.data);
      return null;
  }
}

export async function getDateData(ticker) {
  return fetchData('/date', ticker);
}

export async function getMean(ticker, period) {
  try {
      const url = import.meta.env.VITE_API_URL + '/mean';
      const response = await axios.get(url, {params: {ticker, period}});
      return response.data;
  } catch (err) {
      console.log(err.response?.data);
      return null;
  }
}

export async function getSMA(period, ticker) {
  try {
      const url = import.meta.env.VITE_API_URL + '/sma';
      const response = await axios.get(url, {params: {ticker, period}});
      return response.data;
  } catch (err) {
      console.log(err.response?.data);
      return null;
  }
}

export async function getRsi(ticker) {
  return fetchData('/rsi', ticker);
}

export async function getMACD(ticker) {
  return fetchData('/macd', ticker);
}

export async function getEMA(period, ticker) {
  try {
      const url = import.meta.env.VITE_API_URL + '/ema';
      const response = await axios.get(url, {params: {ticker, period}});
      return response.data;
  } catch (err) {
      console.log(err.response?.data);
      return null;
  }
}

export async function getBollingerBand(ticker) {
  return fetchData('/bollingerband', ticker);
}

/**
 * Récupération des KPIs
 */
export async function getKpiSma(ticker) {
  return fetchData('/kpi/close', ticker);
}

export async function getKpiBollinger(ticker) {
  return fetchData('/kpi/bollinger', ticker);
}

export async function getKpiMacd(ticker) {
  return fetchData('/kpi/macd', ticker);
}

export async function getKpiRsi(ticker) {
  return fetchData('/kpi/rsi', ticker);
}

/**
 * Interactions avec la base de données des tickers
 */
export async function getTickers() {
  return fetchData('/tickers');
}

export async function removeTicker(code) {
  try {
    const url = import.meta.env.VITE_API_URL + `/removeTicker`;
    const response = await axios.get(url, {params: {code}});
    return response.data;
  } catch (err) {
    console.log(err.response?.data);
    return null;
  }
}

export async function addTicker(name, code, isActive) {
  try {
    const url = import.meta.env.VITE_API_URL + `/addTicker`;
    const response = await axios.get(url, {params: {name, code, isActive}});
    return response.data;
  } catch (err) {
    console.log(err.response?.data);
    return null;
  }
}

export async function updateTicker(code, isActive) {
  try {
    const url = import.meta.env.VITE_API_URL + `/updateTicker`;
    const response = await axios.get(url, {params: {code, isActive}});
    return response.data;
  } catch (err) {
    console.log(err.response?.data);
    return null;
  }
}

/**
 * Interactions avec la base de données des tickersScore
 */
export async function getTickersScore() {
  return fetchData('/tickersScore');
}

export async function getTickersScoreWithTicker(code) {
  try {
    const url = import.meta.env.VITE_API_URL + `/tickersScore/getticker`;
    const response = await axios.get(url, {params: { code }});
    return response.data;
  } catch (err) {
    console.log(err.response?.data);
    return null;
  }
}

export async function getTickersScoreWithDay(day) {
  try {
    const url = import.meta.env.VITE_API_URL + `/tickersScore/getday`;
    const response = await axios.get(url, {params: { day }});
    return response.data;
  } catch (err) {
    console.log(err.response?.data);
    return null;
  }
}

export async function getTickersScoreWithTickerAndDay(ticker, day) {
  try {
    const url = import.meta.env.VITE_API_URL + `/tickersScore/gettickerandday`;
    const response = await axios.get(url, {params: { ticker, day }});
    return response.data[0];
  } catch (err) {
    console.log(err.response?.data);
    return null;
  }
}

export async function removeTickerScore(code, day) {
  try {
    const url = import.meta.env.VITE_API_URL + `/tickersScore/remove`;
    const response = await axios.get(url, {params: {code, day}});
    return response.data;
  } catch (err) {
    console.log(err.response?.data);
    return null;
  }
}

export async function addTickerScore(day, code, mm, macd, bollinger, rsi, score) {
  try {
    const url = import.meta.env.VITE_API_URL + `/tickersScore/add`;
    const response = await axios.get(url, {params: {day, code, mm, macd, bollinger, rsi, score}});
    return response.data;
  } catch (err) {
    console.log(err.response?.data);
    return null;
  }
}