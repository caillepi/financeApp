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

export async function getDividend(ticker) {
  const data = await apiCall('/enterprise/dividend', { ticker });
  return data; // dividend, dividendRate
}

export async function getPrimaryInfo(ticker) {
  const data = await apiCall('/enterprise/primaryInfo', { ticker });
  return data; // name, sector, industry, exchangeName, currency
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
  const data = await apiCall('/kpi/sma', { ticker });
  return data.sma;
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
  const data = await apiCall('/tickersScore/getticker', { code });
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
  const data = await apiCall('/marketOrders/getticker', { ticker });
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
  const data = await apiCall('/marketTrades/getticker', { ticker });
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