class Ticker {
    constructor(name, code, isActive) {
        this.name = name;
        this.code = code;
        this.isActive = isActive;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getCode() {
        return this.code;
    }

    setCode(code) {
        this.code = code;
    }

    getIsActive() {
        return this.isActive;
    }

    setIsActive(isActive) {
        this.isActive = isActive
    }
}

module.exports = Ticker;