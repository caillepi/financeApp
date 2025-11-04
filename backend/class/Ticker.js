class Ticker {
    constructor(
        name, code, isActive = false, sector = '', industry = '', 
        exchange = 'Euronext', currency = 'Euro', createdAt = new Date(), updatedAt = new Date()
    ) {
        this.name = name;               // Nom de la société (ex: 'FDJ')
        this.code = code;               // Code du ticker (ex: 'FDJU.PA')
        this.isActive = isActive;       // Statut actif ou non
        this.exchange = exchange;       // Nom de l'échange (ex: 'Euronext')
        this.currency = currency;       // Devise utilisée (ex: 'EUR')
        this.sector = sector;           // Secteur de l'entreprise (ex: 'Consumer Goods')
        this.industry = industry;       // Industrie spécifique (ex: 'Gambling')
        this.createdAt = createdAt;     // Date de création
        this.updatedAt = updatedAt;     // Date de dernière mise à jour
    }

    // Getters et Setters
    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
        updateTimestamp();
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
        updateTimestamp();
    }

    getCode() {
        return this.code;
    }

    setCode(code) {
        this.code = code;
        updateTimestamp();
    }

    getExchange() {
        return this.exchange;
    }

    setExchange(exchange) {
        this.exchange = exchange;
        updateTimestamp();
    }

    getCurrency() {
        return this.currency;
    }

    setCurrency(currency) {
        this.currency = currency;
        updateTimestamp();
    }

    getSector() {
        return this.sector;
    }

    setSector(sector) {
        this.sector = sector;
        updateTimestamp();
    }

    getIndustry() {
        return this.industry;
    }

    setIndustry(industry) {
        this.industry = industry;
        updateTimestamp();
    }

    getIsActive() {
        return this.isActive;
    }

    setIsActive(isActive) {
        this.isActive = isActive;
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
        updateTimestamp();
    }

    // Méthode pour mettre à jour le champ `updatedAt` à chaque modification
    updateTimestamp() {
        setUpdatedAt(new Date()); // Met à jour `updatedAt` à la date actuelle
    }

    // Méthode pour convertir la classe en objet avant de l'insérer dans la BDD
    toDatabaseObject() {
        return {
            name: this.name,
            code: this.code,
            exchange: this.exchange,
            currency: this.currency,
            sector: this.sector,
            industry: this.industry,
            is_active: this.isActive,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        };
    }
}

module.exports = Ticker;