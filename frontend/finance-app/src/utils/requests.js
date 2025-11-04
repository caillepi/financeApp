import { apiCall } from './apiServices'; // Assure-toi que le chemin est correct

// Fonctions spécifiques qui appellent apiCall
export async function getEnterpriseName(ticker) {
  const data = await apiCall('/enterprise/enterprisename', { ticker });
  return data.name;
}

export async function getCurrent(ticker) {
  const data = await apiCall('/enterprise/current', { ticker });
  return data.current;
}

export async function getLow(ticker) {
  const data = await apiCall('/enterprise/low', { ticker });
  return data.low;
}

export async function getHigh(ticker) {
  const data = await apiCall('/enterprise/high', { ticker });
  return data.high;
}

export async function getSector(ticker) {
  const data = await apiCall('/enterprise/sector', { ticker });
  return data.sector;
}

export async function getDescription(ticker) {
  const data = await apiCall('/enterprise/description', { ticker });
  return data.description;
}

export async function getLastOpen(ticker) {
  const data = await apiCall('/analyst/opendata', { ticker });
  if (data?.opendata === 'N/A') return null;
  return data?.opendata ? parseFloat(data.opendata[data.opendata.length - 1].toFixed(2)) : null;
}

export async function getOpenData(ticker) {
  const data = await apiCall('/analyst/opendata', { ticker });
  return data.opendata;
}

export async function getLastClose(ticker) {
  const data = await apiCall('/analyst/closedata', { ticker });
  if (data?.closedata === 'N/A') return null;
  return data?.closedata ? parseFloat(data.closedata[data.closedata.length - 2].toFixed(2)) : null;
}

export async function getCloseData(ticker) {
  const data = await apiCall('/analyst/closedata', { ticker });
  return data.closedata;
}

export async function getVolumeData(ticker) {
  const data = await apiCall('/analyst/volumedata', { ticker });
  return data.volumedata;
}

export async function getMinData(ticker, period) {
  const data = await apiCall('/analyst/mindata', { ticker, period });
  return data.mindata;
}

export async function getMaxData(ticker, period) {
  const data = await apiCall('/analyst/maxdata', { ticker, period });
  return data.maxdata;
}

export async function getMin(ticker, period) {
  const data = await apiCall('/analyst/min', { ticker, period });
  return data.min;
}

export async function getMax(ticker, period) {
  const data = await apiCall('/analyst/max', { ticker, period });
  return data.max;
}

export async function getDateData(ticker) {
  const data = await apiCall('/analyst/date', { ticker });
  return data.dates;
}

export async function getMean(ticker, period) {
  const data = await apiCall('/analyst/mean', { ticker, period });
  return data.mean;
}

export async function getSMA(period, ticker) {
  const data = await apiCall('/analyst/sma', { ticker, period });
  return data.sma;
}

export async function getRsi(ticker) {
  const data = await apiCall('/analyst/rsi', { ticker });
  return data.rsi;
}

export async function getMACD(ticker) {
  const data = await apiCall('/analyst/macd', { ticker });
  return data.macd;
}

export async function getEMA(period, ticker) {
  const data = await apiCall('/analyst/ema', { ticker, period });
  return data.ema;
}

export async function getBollingerBand(ticker) {
  const data = await apiCall('/analyst/bollingerband', { ticker });
  return data.bollingerband;
}

/**
 * Récupération des KPIs
 */
export async function getKpiSma(ticker) {
  const data = await apiCall('/kpi/close', { ticker });
  return data.close;
}

export async function getKpiBollinger(ticker) {
  const data = await apiCall('/kpi/bollinger', { ticker });
  return data.bollinger;
}

export async function getKpiMacd(ticker) {
  const data = await apiCall('/kpi/macd', { ticker });
  return data.macd;
}

export async function getKpiRsi(ticker) {
  const data = await apiCall('/kpi/rsi', { ticker });
  return data.rsi;
}

/**
 * Interactions avec la base de données des tickers
 */
export async function   getTickers() {
  return await apiCall('/tickers');
}

export async function removeTicker(code) {
  return apiCall('/tickers/remove', { code });
}

export async function addTicker(name, code, isActive, sector, industry, exchange, currency) {
  return apiCall('/tickers/add', { name, code, isActive, sector, industry, exchange, currency });
}

export async function updateTicker(code, isActive) {
  return apiCall('/tickers/update', { code, isActive });
}

/**
 * Interactions avec la base de données des tickersScore
 */
export async function getTickersScore() {
  const data = await apiCall('/tickersScore');
  return data.tickersScore;
}

export async function getTickersScoreWithTicker(code) {
  const data = await apiCall('/tickersScore/getticker', { code });
  return data.tickersScore;
}

export async function getTickersScoreWithDay(day) {
  const data = await apiCall('/tickersScore/getday', { day });
  return data.tickersScore;
}

export async function getTickersScoreWithTickerAndDay(ticker, day) {
  const data = await apiCall('/tickersScore/gettickerandday', { ticker, day });
  return data ? data[0] : null;
}

export async function removeTickerScore(code, day) {
  return apiCall('/tickersScore/remove', { code, day });
}

export async function addTickerScore(day, code, mm, macd, bollinger, rsi, score) {
  return apiCall('/tickersScore/add', { day, code, mm, macd, bollinger, rsi, score });
}

/**
 * Gestion des sessions
 */
export async function apiLogin(username, password) {
  try {
    const response = await apiCall('/session/login', { username, password }, "POST");
    return response;
  } catch (err) {
    console.log(err);
    return err.response?.data?.message || 'Erreur lors de la connexion';
  }
}

export async function apiLogout() {
  try {
    const response = await apiCall("/session/logout", null, "POST");
    return response.message;
  } catch (err) {
    if (err.response?.status === 401) {
      console.log('Utilisateur non authentifié, redirection vers /login');
      navigate('/login');
    } else {
      console.log(err.response?.data || err);
    }
    return null;
  }
}

export async function checkAuth() {
  return apiCall('/session/check-auth');
}