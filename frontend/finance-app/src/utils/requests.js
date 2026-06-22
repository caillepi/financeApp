import { apiCall } from './apiServices'; // Assure-toi que le chemin est correct

// Fonctions spécifiques qui appellent apiCall
export async function getEnterpriseName(ticker) {
  const data = await apiCall(`/enterprise/${ticker}/enterprisename`);
  return data.name;
}

export async function getCurrent(ticker) {
  const data = await apiCall(`/enterprise/${ticker}/current`);
  return data.current;
}

export async function getLow(ticker) {
  const data = await apiCall(`/enterprise/${ticker}/low`);
  return data.low;
}

export async function getHigh(ticker) {
  const data = await apiCall(`/enterprise/${ticker}/high`);
  return data.high;
}

export async function getSector(ticker) {
  const data = await apiCall(`/enterprise/${ticker}/sector`);
  return data.sector;
}

export async function getDescription(ticker) {
  const data = await apiCall(`/enterprise/${ticker}/description`);
  return data.description;
}

export async function getDividend(ticker) {
  const data = await apiCall(`/enterprise/${ticker}/dividend`);
  return data; // dividend, dividendRate
}

export async function getAverageAnalystRating(ticker) {
  const data = await apiCall(`/enterprise/${ticker}/averageAnalystRating`);
  return data.analystRating;
}

export async function getPrimaryInfo(ticker) {
  const data = await apiCall(`/enterprise/${ticker}/primaryInfo`);
  return data; // name, sector, industry, exchangeName, currency
}

export async function getLastOpen(ticker) {
  const data = await apiCall(`/analyst/${ticker}/opendata`);
  if (data?.opendata === 'N/A') return null;
  const openData = Array.isArray(data?.opendata) ? data.opendata : null;
  if (!openData || openData.length === 0) return null;
  const lastValue = openData[openData.length - 1];
  if (lastValue === null || lastValue === undefined) return null;
  return parseFloat(lastValue.toFixed ? lastValue.toFixed(2) : parseFloat(lastValue).toFixed(2));
}

export async function getOpenData(ticker) {
  const data = await apiCall(`/analyst/${ticker}/opendata`);
  return data.opendata;
}

export async function getLastClose(ticker) {
  const data = await apiCall(`/analyst/${ticker}/closedata`);
  if (data?.closedata === 'N/A') return null;
  const closeData = Array.isArray(data?.closedata) ? data.closedata : null;
  if (!closeData || closeData.length < 2) return null;
  const value = closeData[closeData.length - 2];
  if (value === null || value === undefined) return null;
  return parseFloat(value.toFixed ? value.toFixed(2) : parseFloat(value).toFixed(2));
}

export async function getCloseData(ticker) {
  const data = await apiCall(`/analyst/${ticker}/closedata`);
  return data.closedata;
}

export async function getVolumeData(ticker) {
  const data = await apiCall(`/analyst/${ticker}/volumedata`);
  return data.volumedata;
}

export async function getMinData(ticker, period) {
  const data = await apiCall(`/analyst/${ticker}/mindata`, { period });
  return data.mindata;
}

export async function getMaxData(ticker, period) {
  const data = await apiCall(`/analyst/${ticker}/maxdata`, { period });
  return data.maxdata;
}

export async function getMin(ticker, period) {
  const data = await apiCall(`/analyst/${ticker}/min`, { period });
  return data.min;
}

export async function getMax(ticker, period) {
  const data = await apiCall(`/analyst/${ticker}/max`, { period });
  return data.max;
}

export async function getDateData(ticker) {
  const data = await apiCall(`/analyst/${ticker}/date`);
  return data.dates;
}

export async function getMean(ticker, period) {
  const data = await apiCall(`/analyst/${ticker}/mean`, { period });
  return data.mean;
}

export async function getSMA(period, ticker) {
  const data = await apiCall(`/analyst/${ticker}/sma`, { period });
  return data.sma;
}

export async function getRsi(ticker) {
  const data = await apiCall(`/analyst/${ticker}/rsi`);
  return data.rsi;
}

export async function getMACD(ticker) {
  const data = await apiCall(`/analyst/${ticker}/macd`);
  return data.macd;
}

export async function getEMA(period, ticker) {
  const data = await apiCall(`/analyst/${ticker}/ema`, { period });
  return data.ema;
}

export async function getBollingerBand(ticker) {
  const data = await apiCall(`/analyst/${ticker}/bollingerband`);
  return data.bollingerband;
}

/**
 * Récupération des KPIs
 */
export async function getKpiSma(ticker) {
  const data = await apiCall(`/kpi/${ticker}/sma`);
  return data.sma;
}

export async function getKpiBollinger(ticker) {
  const data = await apiCall(`/kpi/${ticker}/bollinger`);
  return data.bollinger;
}

export async function getKpiMacd(ticker) {
  const data = await apiCall(`/kpi/${ticker}/macd`);
  return data.macd;
}

export async function getKpiRsi(ticker) {
  const data = await apiCall(`/kpi/${ticker}/rsi`);
  return data.rsi;
}

/**
 * Interactions avec la base de données des tickers
 */
export async function getTickers() {
  return await apiCall('/tickers');
}

export async function removeTicker(code) {
  return apiCall('/tickers/remove', { code });
}

export async function addTicker(ticker) {
  return apiCall('/tickers/add', {ticker: ticker}, 'POST');
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
  const data = await apiCall(`/tickersScore/${code}`);
  return data.tickersScore;
}

export async function getTickersScoreWithDay(day) {
  const data = await apiCall('/tickersScore/getday', { day });
  return data;
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
 * Interractions avec la base de données des market orders
 */
export async function getMarketOrders() {
  const data = await apiCall('/marketOrders');
  return data;
} 

export async function getMarketOrdersByTicker(ticker) {
  const data = await apiCall(`/marketOrders/${ticker}`);
  return data;
}

export async function getMarketOrdersByDay(day) {
  const data = await apiCall('/marketOrders/getday', { day });
  return data;
}

export async function getMarketOrdersByTickerAndDay(ticker, day) {
  const data = await apiCall('/marketOrders/gettickerandday', { ticker, day });
  return data;
}

export async function addMarketOrder(code, type, quantity, price, date) {
  return apiCall('/marketOrders/add', { code, type, quantity, price, date });
}

export async function removeMarketOrder(order_id) {
  return apiCall('/marketOrders/remove', { order_id });
}


/**
 * * Interractions avec la base de données des market trades
 */
export async function getMarketTrades() {
  const data = await apiCall('/marketTrades');
  return data;
}

export async function getMarketTradesByTicker(ticker) {
  const data = await apiCall(`/marketTrades/${ticker}`);
  return data;
} 

export async function getMarketTradesByDay(day) {
  const data = await apiCall('/marketTrades/getday', { day });
  return data;
} 

export async function getMarketTradesByTickerAndDay(ticker, day) {
  const data = await apiCall('/marketTrades/gettickerandday', { ticker, day });
  return data;
} 

export async function addMarketTrade(code, order_id, trade_type, quantity, price, date) {
  return apiCall('/marketTrades/add', { code, order_id, trade_type, quantity, price, date });
}

export async function removeMarketTrade(trade_id) {
  return apiCall('/marketTrades/remove', { trade_id });
}

export async function quantityHeldByCode(code) {
  const data = await apiCall('/marketTrades/quantityHeld', { code });
  return data.quantity
}

export async function averageBuyPriceByCode(code) {
  const data = await apiCall('/marketTrades/averageBuyPrice', { code });
  return data.averageBuyPrice;
}

export async function averageBuyDateByCode(code) {
  const data = await apiCall('/marketTrades/averageBuyDate', { code });
  return data.averageBuyDate;
}

export async function currentValueByCode(code) {
  const data = await apiCall('/marketTrades/currentValue', { code });
  return data.currentValue;
}

export async function profitLossByCode(code, current) {
  const data = await apiCall('/marketTrades/profitLoss', { code, current });
  return data.profitLoss;
}

/**
 * Gestion des sessions
 */
export async function apiLogin(form) {
  try {
    const response = await apiCall('/session/login', {form: form}, "POST");
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