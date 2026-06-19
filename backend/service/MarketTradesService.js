const pool = require('../utils/bddClient');
const { staticCache, dynamicCache } = require('../utils/cache');

class MarketTradesService {

    static async getAll() {
        try {
            return await dynamicCache.getOrSet('market_trades:all', async () => {
                const { data, error } = await pool.from('market_trades').select('*');
                if (error) {
                    console.error('Erreur lors de la récupération des market_trades');
                    throw new Error(error.message);
                }
                return data;
            }, { ttl: 1000 * 60 * 60 });
        }
        catch (err) {
            console.error('Erreur interne à getAll : ', err);
            throw err;
        }
    }

    static async getByCode(code) {
        try {
            const key = `market_trades:code:${code}`;
            return await dynamicCache.getOrSet(key, async () => {
                const { data, error } = await pool
                    .from('market_trades')
                    .select('*')
                    .eq('code_ticker', code);
                if (error) {
                    console.error('Erreur lors de la récupération des market_trades pour ' + code);
                    throw new Error(error.message);
                }
                return data;
            }, { ttl: 1000 * 60 * 60 });
        }
        catch (err) {
            console.error('Erreur interne à getByCode : ', err);
            throw err;
        }
    }

    static async getByDate(date) {
        try {
            const [year, month, day] = date.split('-').map(Number);
            const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
            const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

            const key = `market_trades:date:${date}`;
            return await dynamicCache.getOrSet(key, async () => {
                const { data, error } = await pool
                    .from('market_trades')
                    .select('*')
                    .gte('created_at', startOfDay.toISOString())
                    .lte('created_at', endOfDay.toISOString());
                if (error) {
                    console.error('Erreur lors de la récupération des market_trades pour la date ' + date);
                    throw new Error(error.message);
                }
                return data;
            }, { ttl: 1000 * 60 * 60 });
        }
        catch (err) {
            console.error('Erreur interne à getByDate : ', err);
            throw err;
        }
    }

    static async getByCodeAndDate(code, date) {
        try {
            const [year, month, day] = date.split('-').map(Number);
            const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
            const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

            const key = `market_trades:code:${code}:date:${date}`;
            return await dynamicCache.getOrSet(key, async () => {
                const { data, error } = await pool
                    .from('market_trades')
                    .select('*')
                    .eq('code_ticker', code)
                    .gte('created_at', startOfDay.toISOString())
                    .lte('created_at', endOfDay.toISOString());
                if (error) {
                    console.error(`Erreur lors de la récupération des market_trades pour ${code} à la date ${date}`);
                    throw new Error(error.message);
                }
                return data;
            }, { ttl: 1000 * 60 * 60 });
        }
        catch (err) {
            console.error('Erreur interne à getByCodeAndDate : ', err);
            throw err;
        }
    }

    static async add(marketTrade) {
        try {
            const { data, error } = await pool
                .from('market_trades')
                .insert(marketTrade.toJSON());

            if (error) {
                console.error('Erreur lors de l\'ajout du market_trade pour ' + marketTrade.code_ticker);
                throw new Error(error.message);
            }

            // invalider cache lié (dynamic)
            try {
                dynamicCache.invalidate('market_trades:all');
                if (marketTrade.code_ticker) dynamicCache.invalidate(`market_trades:code:${marketTrade.code_ticker}`);
                if (marketTrade.created_at) {
                    const d = new Date(marketTrade.created_at);
                    const dateKey = d.toISOString().slice(0,10);
                    dynamicCache.invalidate(`market_trades:date:${dateKey}`);
                    dynamicCache.invalidate(`market_trades:code:${marketTrade.code_ticker}:date:${dateKey}`);
                }
            } catch(e){}

            return data;
        }
        catch (err) {
            console.error('Erreur interne à add : ', err);
            throw err;
        }
    }

    static async remove(code, date) {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const { data, error } = await pool
                .from('market_trades')
                .delete()
                .eq('code_ticker', code)
                .gte('created_at', startOfDay.toISOString())
                .lte('created_at', endOfDay.toISOString());

            if (error) {
                console.error('Erreur lors de la suppression des market_trades pour ' + code);
                throw new Error(error.message);
            }

            // invalider cache lié (dynamic)
            try {
                dynamicCache.invalidate('market_trades:all');
                dynamicCache.invalidate(`market_trades:code:${code}`);
                const dateKey = new Date(date).toISOString().slice(0,10);
                dynamicCache.invalidate(`market_trades:date:${dateKey}`);
                dynamicCache.invalidate(`market_trades:code:${code}:date:${dateKey}`);
            } catch(e){}

            return data;
        }
        catch (err) {
            console.error('Erreur interne à remove : ', err);
            throw err;
        }
    }

    static async update(id, updates) {
        try {
            const { data, error } = await pool
                .from('market_trades')
                .update(updates)
                .eq('id', id);

            if (error) {
                console.error('Erreur lors de la mise à jour du market_trade id=' + id);
                throw new Error(error.message);
            }

            try { dynamicCache.invalidate('market_trades:all'); } catch(e){}
            return data;
        }
        catch (err) {
            console.error('Erreur interne à update : ', err);
            throw err;
        }
    }

    static async getQuantityHeldByCode(code) {
        try {
            const { data, error } = await pool
                .from('market_trades')
                .select('trade_type, quantity')
                .eq('code_ticker', code);

            if (error) {
                console.error('Error when retrieving quantity held for code ' + code);
                throw new Error(error.message);
            }

            let totalQuantity = 0;

            data.forEach(trade => {
                if (trade.trade_type === 'buy') {
                    totalQuantity += trade.quantity;
                }
                else if (trade.trade_type === 'sell') {
                    totalQuantity -= trade.quantity;
                }
            });
            return totalQuantity;
        }
        catch (err) {
            console.error('Erreur interne à getQuantityHeldByCode : ', err);
            throw err;
        }
    }

    static async getAverageBuyPriceByCode(code) {
        try {
            const { data, error } = await pool
                .from('market_trades')
                .select('trade_type, quantity, price')
                .eq('code_ticker', code);
                
            if (error) {
                console.error('Error when retrieving average buy price for code ' + code);
                throw new Error(error.message);
            }

            let totalValue = 0;
            let totalQuantity = 0;

            data.forEach(trade => {
                if (trade.trade_type === 'buy') {
                    totalValue += trade.quantity * trade.price;
                    totalQuantity += trade.quantity;
                }
            });

            return totalQuantity > 0 ? totalValue / totalQuantity : 0;
        }
        catch (err) {
            console.error('Erreur interne à getAverageBuyPriceByCode : ', err);
            throw err;
        }
    }

    static async getAverageBuyDateByCode(code) {
        try {
            const { data, error } = await pool
                .from('market_trades')
                .select('trade_type, quantity, created_at')
                .eq('code_ticker', code);
                
            if (error) {
                console.error('Error when retrieving average buy date for code ' + code);
                throw new Error(error.message);
            }

            let totalTimestamp = 0;
            let count = 0;

            data.forEach(trade => {
                if (trade.trade_type === 'buy') {
                    totalTimestamp += new Date(trade.created_at).getTime();
                    count++;
                }
            });

            return count > 0 ? new Date(totalTimestamp / count) : null;
        }
        catch (err) {
            console.error('Erreur interne à getAverageBuyDateByCode : ', err);
            throw err;
        }
    }

    static async getCurrentValueByCode(code) {
        try {
            const { data, error } = await pool
                .from('market_trades')
                .select('trade_type, quantity, price')
                .eq('code_ticker', code);

            if (error) {
                console.error('Error when retrieving current value for code ' + code);
                throw new Error(error.message);
            }

            let totalValue = 0;
            data.forEach(trade => {
                if (trade.trade_type === 'buy') {
                    totalValue += trade.quantity * trade.price;
                }
                else if (trade.trade_type === 'sell') {
                    totalValue -= trade.quantity * trade.price;
                }
            });
            
            return totalValue;
        }
        catch (err) {
            console.error('Erreur interne à getCurrentValueByCode : ', err);
            throw err;
        }
    }

    static async getProfitLossByCode(code, current) {
        try {          
            const quantityHeld = await this.getQuantityHeldByCode(code);
            const averageBuyPrice = await this.getAverageBuyPriceByCode(code);
            const profitLoss = quantityHeld * (current - averageBuyPrice);
            return profitLoss;
        }
        catch (err) {
            console.error('Erreur interne à getProfitLossByCode : ', err);
            throw err;
        }
    }
}

module.exports = MarketTradesService;