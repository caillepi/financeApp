class TickerScore {
    constructor(day, code, mm, macd, bollinger, rsi, score) {
        this.day = day;
        this.code = code;
        this.mm = mm;
        this.macd = macd;
        this.bollinger = bollinger;
        this.rsi = rsi;
        this.score = score;
    }

    getDay() {
        return this.day;
    }

    setDay(day) {
        this.day = day;
    }

    getCode() {
        return this.code;
    }

    setCode(code) {
        this.code = code;
    }

    getMm() {
        return this.mm;
    }

    setMm(mm) {
        this.mm = mm;
    }

    getMacd() {
        return this.macd;
    }

    setMacd(macd) {
        this.macd = macd;
    }

    getBollinger() {
        return this.bollinger;
    }

    setBollinger(bollinger) {
        this.bollinger = bollinger;
    }

    getRsi() {
        return this.rsi;
    }

    setRsi(rsi) {
        this.rsi = rsi;
    }

    getScore() {
        return this.score;
    }

    setScore(score) {
        this.score = score;
    }
}

module.exports = TickerScore;