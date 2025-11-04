class TickerScore {
    constructor(code, mm, macd, bollinger, rsi, score,
        createdAt = new Date(), updatedAt = new Date(), scoreVersion = "v1"
    ) {
        this.code = code;
        this.mm = mm;
        this.macd = macd;
        this.bollinger = bollinger;
        this.rsi = rsi;
        this.score = score;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.scoreVersion = scoreVersion;
    }

    getCode() {
        return this.code;
    }

    setCode(code) {
        this.code = code;
        updateTimestamp();
    }

    getMm() {
        return this.mm;
    }

    setMm(mm) {
        this.mm = mm;
        updateTimestamp();
    }

    getMacd() {
        return this.macd;
    }

    setMacd(macd) {
        this.macd = macd;
        updateTimestamp();
    }

    getBollinger() {
        return this.bollinger;
    }

    setBollinger(bollinger) {
        this.bollinger = bollinger;
        updateTimestamp();
    }

    getRsi() {
        return this.rsi;
    }

    setRsi(rsi) {
        this.rsi = rsi;
        updateTimestamp();
    }

    getScore() {
        return this.score;
    }

    setScore(score) {
        this.score = score;
        updateTimestamp();
    }

    getCreatedAt() {
        return this.createdAt;
    }

    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
        updateTimestamp();
    }

    getUpdatedAt() {
        return this.updatedAt;
    }

    setUpdatedAt(updatedAt) {
        this.updatedAt = updatedAt;
    }

    getScoreVersion() {
        return this.scoreVersion;
    }

    setScoreVersion(scoreVersion) {
        this.scoreVersion = scoreVersion;
    }

    updateTimestamp() {
        setUpdatedAt(new Date());
    }

    toDatabaseObject() {
        return {
            code: this.code,
            mm: this.mm,
            macd: this.macd,
            bollinger: this.bollinger,
            rsi: this.rsi,
            score: this.score,
            scoreVersion: this.scoreVersion,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
}

module.exports = TickerScore;