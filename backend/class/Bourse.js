const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"], // Désactive le message de survey
});

class Bourse {
    /**
     * Classe pour enregistrer une entreprise en bourse
     * @param {string} ticker - Code de l'entreprise
     * @param {string} periodAnalysed - Durée de l'analyse (e.g., '1d', '1mo', '1y')
     */
    constructor(ticker, periodAnalysed) {
        this.ticker = ticker;
        this.periodAnalysed = periodAnalysed;
        this.data = null;
        this.name = null;
        this.current = null;
        this.low = null;
        this.high = null;
        this.sector = null;
        this.history = null;
        this.analyst = null;
    }

    async init() {        
        await this.getData();
        this.name = this.getName();
        this.current = this.getCurrent();
        this.low = this.getLow();
        this.high = this.getHigh();
        this.sector = await this.getSector();
        this.dividend = 0;
        this.history = await this.getHistory();
        this.analyst = await this.getAverageAnalystRating();
    }

    async getData() {
        try {
            this.data = await yahooFinance.quote(this.ticker);
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Ticker error : ${this.ticker} is not found`)
                this.data = null;
            }
            else {
                console.error(`Error fetching data (${this.ticker})`);
                this.data = null;
            }
        }
    }

    getName() {
        return this.data?.longName || this.data?.shortName || 'N/A';
    }

    getCurrent() {
        return this.data?.regularMarketPrice || 'N/A';
    }

    getLow() {
        return this.data?.regularMarketDayLow || 'N/A';
    }

    getHigh() {
        return this.data?.regularMarketDayHigh || 'N/A';
    }

    getDividend() {
        // ?? permet que si le dividende est à 0, on garde 0 et on n'a pas 'N/A'
        return [this.data?.trailingAnnualDividendRate ?? 'N/A', this.data?.trailingAnnualDividendYield ?? 'N/A']
    }

    async getSector() {
        try {
            let data = await yahooFinance.quoteSummary(this.ticker, { modules: ['assetProfile'] });
            return data.assetProfile?.sector;
        } catch (error) {
            console.error(`Error fetching sector (${this.ticker})`);
            return 'N/A';
        }
    }

    async getIndustry() {
        try {
            let data = await yahooFinance.quoteSummary(this.ticker, { modules: ['assetProfile'] });
            return data.assetProfile?.industry;
        } catch (error) {
            console.error(`Error fetching industry (${this.ticker})`);
            return 'N/A';
        }
    }

    async getDescription() {
        try {
            let data = await yahooFinance.quoteSummary(this.ticker, { modules: ['assetProfile'] });
            return data.assetProfile?.longBusinessSummary;
        } catch (error) {
            console.error(`Error fetching ticker description (${this.ticker})`);
            return 'N/A';
        }
    }

    getExchangeName() {
        return this.data?.fullExchangeName || 'N/A';
    }

    getCurrency() {
        return this.data?.currency || 'N/A';
    }

    getAverageAnalystRating() {
        return this.data?.averageAnalystRating || 'N/A';
    }

    async getHistory() {
        if (this.data == null) {
            return 'N/A';
        }
        else {
            try {
                const endDate = new Date();
                const startDate = new Date();
    
                // Set the start date based on the period
                if (this.periodAnalysed === '1mo') {
                    startDate.setMonth(endDate.getMonth() - 1);
                } else if (this.periodAnalysed === '3mo') {
                    startDate.setMonth(endDate.getMonth() - 3);
                } else if (this.periodAnalysed === '6mo') {
                    startDate.setMonth(endDate.getMonth() - 6);
                } else if (this.periodAnalysed === '1y') {
                    startDate.setFullYear(endDate.getFullYear() - 1);
                } else if (this.periodAnalysed === '2y') {
                    startDate.setFullYear(endDate.getFullYear() - 2);
                } else if (this.periodAnalysed === '3y') {
                    startDate.setFullYear(endDate.getFullYear() - 3)
                } else if (this.periodAnalysed === '5y') {
                    startDate.setFullYear(endDate.getFullYear() - 5);
                } else {
                    throw new Error('Invalid period. Use one of: 1m, 3m, 6m, 1y, 2y, 5y');
                }
    
                const result = await yahooFinance.chart(this.ticker, {
                    period1: startDate,
                    interval: '1d'
                });
                return result.quotes;
            } catch (error) {
                console.error(`Error fetching historical data (${this.ticker}):`, error);
                return 'N/A';
            }
        }
    }

    toString() {
        return `Current stock price: ${this.current},\nLower stock price of the day: ${this.low},\nHigher stock price of the day: ${this.high}`;
    }
}

module.exports = Bourse;