const pool = require('../utils/bddClient');

class TickerScoreService {
    /**
     * Permet de récupérer tous les tickerScores présents en base
     * @returns Liste de tous les tickerScores
     */
    static async getAll() {
        try {
            const { data, error } = await pool.from('tickerScore').select('*');

            if (error) {
                console.error('Erreur lors de la récupération des tickersScores');
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
     * Permet de récupérer tous les tickerScores correspondant à un ticker donné. Le ticker est représenté par son code
     * @param {String} code Code du ticker
     * @returns Retourne les tickerScore du code correspondant
     */
    static async getByCode(code) {
        try {
            const { data, error } = await pool.from('tickerScore').select('*').eq('code', code);

            if (error) {
                console.error('Erreur lors de la récupération du tickerScore pour le ticker ' + code);
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
     * Permet de récupérer tous les tickerScores correspondant à une date en particulier.
     * La date doit être sous forme de chaîne "YYYY-MM-DD" (ex : "2025-11-04").
     * @param {String} date Date du ticker sous forme de chaîne "YYYY-MM-DD"
     * @returns {Promise<Array>} Retourne les tickerScores de cette date
     */
    static async getByDate(date) {
        try {
            const [year, month, day] = date.split('-').map(Number);
            const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
            const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

            const { data, error } = await pool
                .from('tickerScore')
                .select('*')
                .gte('created_at', startOfDay.toISOString())
                .lte('created_at', endOfDay.toISOString());           

            if (error) {
                console.error('Erreur lors de la récupération des tickerScores pour la date ' + date);
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
                .from('tickerScore')
                .select('*')
                .eq('code', code)
                .gte('created_at', startOfDay.toISOString())
                .lte('created_at', endOfDay.toISOString());

            if (error) {
                console.error('Erreur lors de la récupération des tickerScore pour ' + code + " et pour la date " + date);
            }

            return data;
        }
        catch (err) {
            console.error('Erreur interne à getByCodeAndDate : ', err);
            throw err;
        }
    }

    static async add(tickerScore){
        try {
            const { data, error } = await pool.from('tickerScore').insert({
                code: tickerScore.getCode(),
                mm: tickerScore.getMm(),
                macd: tickerScore.getMacd(),
                bollinger: tickerScore.getBollinger(),
                rsi: tickerScore.getRsi(),
                score: tickerScore.getScore(),
                created_at: tickerScore.getCreatedAt(),
                updated_at: tickerScore.getUpdatedAt(),
                score_version: tickerScore.getScoreVersion(),
            });

            if (error) {
                console.error('Erreur lors de l\'ajout du tickerScore pour le ticker ' + tickerScore.getCode());
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
                .from('tickerScore')
                .delete()
                .eq('code', code)
                .gte('created_at', startOfDay.toISOString())
                .lte('created_at', endOfDay.toISOString());

            if (error) {
                console.error('Erreur lors de la suppression du tickerScore pour le ticker ' + code);
                throw new Error(error.message);
            }

            return data;
        }
        catch (err) {
            console.error('Erreur interne à remove : ', err);
            throw err;
        }
    }

    static async update(updates) {
        try {
            const { data, error } = await pool.from('tickerScore').update(updates).eq('code', code);

            if (error) {
                console.error('Erreur de la modification du tickerScore pour le ticker ' + code);
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

module.exports = TickerScoreService;