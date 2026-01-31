const pool = require('../utils/bddClient');

class MarketTradesService {

    static async getAll() {
        try {
            const { data, error } = await pool.from('market_trades').select('*');

            if (error) {
                console.error('Erreur lors de la récupération des market_trades');
                throw new Error(error.message);
            }

            return data;
        }
        catch (err) {
            console.error('Erreur interne à getAll : ', err);
            throw err;
        }
    }

    static async getByCode(code) {
        try {
            const { data, error } = await pool
                .from('market_trades')
                .select('*')
                .eq('code_ticker', code);

            if (error) {
                console.error('Erreur lors de la récupération des market_trades pour ' + code);
                throw new Error(error.message);
            }

            return data;
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

            return data;
        }
        catch (err) {
            console.error('Erreur interne à update : ', err);
            throw err;
        }
    }
}

module.exports = MarketTradesService;