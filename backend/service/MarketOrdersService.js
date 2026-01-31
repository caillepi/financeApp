const pool = require('../utils/bddClient');

class MarketOrdersService {

    /**
     * Récupère tous les market orders
     */
    static async getAll() {
        try {
            const { data, error } = await pool.from('market_orders').select('*');

            if (error) {
                console.error('Erreur lors de la récupération des market_orders');
                throw new Error(error.message);
            }

            return data;
        }
        catch (err) {
            console.error('Erreur interne à getAll : ', err);
            throw err;
        }
    }

    /**
     * Récupère les market orders pour un ticker donné
     */
    static async getByCode(code) {
        try {
            const { data, error } = await pool
                .from('market_orders')
                .select('*')
                .eq('code_ticker', code);

            if (error) {
                console.error('Erreur lors de la récupération des market_orders pour ' + code);
                throw new Error(error.message);
            }

            return data;
        }
        catch (err) {
            console.error('Erreur interne à getByCode : ', err);
            throw err;
        }
    }

    /**
     * Récupère les market orders pour une date donnée (YYYY-MM-DD)
     */
    static async getByDate(date) {
        try {
            const [year, month, day] = date.split('-').map(Number);
            const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
            const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

            const { data, error } = await pool
                .from('market_orders')
                .select('*')
                .gte('created_at', startOfDay.toISOString())
                .lte('created_at', endOfDay.toISOString());

            if (error) {
                console.error('Erreur lors de la récupération des market_orders pour la date ' + date);
                throw new Error(error.message);
            }

            return data;
        }
        catch (err) {
            console.error('Erreur interne à getByDate : ', err);
            throw err;
        }
    }

    /**
     * Récupère les market orders pour un ticker et une date donnée
     */
    static async getByCodeAndDate(code, date) {
        try {
            const [year, month, day] = date.split('-').map(Number);
            const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
            const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

            const { data, error } = await pool
                .from('market_orders')
                .select('*')
                .eq('code_ticker', code)
                .gte('created_at', startOfDay.toISOString())
                .lte('created_at', endOfDay.toISOString());

            if (error) {
                console.error(`Erreur lors de la récupération des market_orders pour ${code} à la date ${date}`);
                throw new Error(error.message);
            }

            return data;
        }
        catch (err) {
            console.error('Erreur interne à getByCodeAndDate : ', err);
            throw err;
        }
    }

    /**
     * Ajoute un market order
     */
    static async add(marketOrder) {
        try {
            const { data, error } = await pool
                .from('market_orders')
                .insert(marketOrder.toJSON());

            if (error) {
                console.error('Erreur lors de l\'ajout du market_order pour ' + marketOrder.code_ticker);
                throw new Error(error.message);
            }

            return data;
        }
        catch (err) {
            console.error('Erreur interne à add : ', err);
            throw err;
        }
    }

    /**
     * Supprime des market orders par ticker et date
     */
    static async remove(code, date) {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const { data, error } = await pool
                .from('market_orders')
                .delete()
                .eq('code_ticker', code)
                .gte('created_at', startOfDay.toISOString())
                .lte('created_at', endOfDay.toISOString());

            if (error) {
                console.error('Erreur lors de la suppression des market_orders pour ' + code);
                throw new Error(error.message);
            }

            return data;
        }
        catch (err) {
            console.error('Erreur interne à remove : ', err);
            throw err;
        }
    }

    /**
     * Met à jour un market order (par id)
     */
    static async update(id, updates) {
        try {
            const { data, error } = await pool
                .from('market_orders')
                .update(updates)
                .eq('id', id);

            if (error) {
                console.error('Erreur lors de la mise à jour du market_order id=' + id);
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

module.exports = MarketOrdersService;