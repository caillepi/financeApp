class MarketTrade {
  constructor({
    id = null,
    created_at = new Date(),
    code_ticker = null,
    order_id = null,
    trade_type = '',
    quantity = null,
    price = null,
    fees = null,
    executed_at = null
  } = {}) {
    this._id = id;
    this._created_at = created_at;
    this._code_ticker = code_ticker;
    this._order_id = order_id;
    this._trade_type = trade_type;
    this._quantity = quantity;
    this._price = price;
    this._fees = fees;
    this._executed_at = executed_at;
  }

  // ───── GETTERS ─────
  get id() { return this._id; }
  get created_at() { return this._created_at; }
  get code_ticker() { return this._code_ticker; }
  get order_id() { return this._order_id; }
  get trade_type() { return this._trade_type; }
  get quantity() { return this._quantity; }
  get price() { return this._price; }
  get fees() { return this._fees; }
  get executed_at() { return this._executed_at; }

  // ───── SETTERS ─────
  set code_ticker(value) { this._code_ticker = value; }
  set order_id(value) { this._order_id = value; }
  set trade_type(value) { this._trade_type = value; }
  set quantity(value) { this._quantity = value; }
  set price(value) { this._price = value; }
  set fees(value) { this._fees = value; }
  set executed_at(value) { this._executed_at = value; }

  toJSON() {
    return {
      id: this._id,
      created_at: this._created_at,
      code_ticker: this._code_ticker,
      order_id: this._order_id,
      trade_type: this._trade_type,
      quantity: this._quantity,
      price: this._price,
      fees: this._fees,
      executed_at: this._executed_at
    };
  }
}

module.exports = MarketTrade;