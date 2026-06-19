const pool = require('../utils/bddClient');
const { staticCache, dynamicCache } = require('../utils/cache');

/**
 * Classe qui permet d'interagir avec la table 'ticker' de la BDD
 */
class TickerService {
    static async getAll() {
        try {
            return await staticCache.getOrSet('ticker:all', async () => {
                const { data, error } = await pool.from('ticker').select('*');
                if (error) {
                    console.error('Erreur lors de la récupération des tickers')
                    throw new Error(error.message);
                }
                return data;
            }, { ttl: null }); // static data: never expire by default
        }
        catch (err) {
            console.error("Erreur interne à getAllTickers : " + err);
            throw err;
        }
    }

    static async getByCode(code) {
        try {
            const key = `ticker:code:${code}`;
            return await staticCache.getOrSet(key, async () => {
                const { data, error } = await pool.from('ticker').select('*').eq('code', code);
                if (error) {
                    console.error('Erreur lors de la récupération du ticker ' + code);
                    throw new Error(error.message);
                }
                return data;
            }, { ttl: null });

        }
        catch (err) {
            console.error('Erreur interne à getByCode : ', err);
            throw err;
        }
    }

    static async add(ticker) {
        try {
            const { data, error } = await pool.from('ticker').insert({
                name: ticker.getName(),
                code: ticker.getCode(),
                exchange: ticker.getExchange(),
                currency: ticker.getCurrency(),
                sector: ticker.getSector(),
                industry: ticker.getIndustry(),
                is_active: ticker.getIsActive(),
                created_at: ticker.getCreatedAt(),
                updated_at: ticker.getUpdatedAt()
            });

            if (error) {
                console.error('Erreur lors de l\'ajout du ticker ' + ticker.getCode());
                throw new Error(error.message);
            }

            // invalider cache ticker (static)
            try {
                staticCache.invalidate('ticker:all');
                staticCache.invalidate(`ticker:code:${ticker.getCode()}`);
            } catch(e){}

            return data;
        }
        catch (err) {
            console.error('Erreur interne à add : ', err);
            throw err;
        }
    }

    static async remove(code) {
        try {
            const { data, error } = await pool.from('ticker').delete().eq('code', code);

            if (error) {
                console.error('Erreur lors de la suppression du ticker ' + code);
                throw new Error(error.message);
            }

            try { staticCache.invalidate('ticker:all'); } catch(e){}
            staticCache.invalidate(`ticker:code:${code}`);
            return data;
        }
        catch (err) {
            console.error('Erreur interne à remove : ', err);
            throw err;
        }
    }

    static async update(code, updates) {
        try {
            const { data, error } = await pool.from('ticker').update(updates).eq('code', code);            

            if (error) {
                console.error('Erreur de la modification du ticker ' + code);
                throw new Error(error.message);
            }

            try { staticCache.invalidate('ticker:all'); } catch(e){}
            staticCache.invalidate(`ticker:code:${code}`);
            return data;

        }
        catch (err) {
            console.error('Erreur interne à update : ', err);
            throw err;
        }
    }
}

module.exports = TickerService;