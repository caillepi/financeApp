class MarketOrder {
  constructor({
    id = null,
    code_ticker = null,
    order_type = '',
    order_kind = '',
    quantity = null,
    price_order = null,
    stop_price = null,
    status = '',
    filled_quantity = null,
    avg_filled_price = null,
    fees = null,
    created_at = new Date(),
    executed_at = null
  } = {}) {
    this._id = id;
    this._code_ticker = code_ticker;
    this._order_type = order_type;
    this._order_kind = order_kind;
    this._quantity = quantity;
    this._price_order = price_order;
    this._stop_price = stop_price;
    this._status = status;
    this._filled_quantity = filled_quantity;
    this._avg_filled_price = avg_filled_price;
    this._fees = fees;
    this._created_at = created_at;
    this._executed_at = executed_at;
  }

  // ───── GETTERS ─────
  get id() { return this._id; }
  get code_ticker() { return this._code_ticker; }
  get order_type() { return this._order_type; }
  get order_kind() { return this._order_kind; }
  get quantity() { return this._quantity; }
  get price_order() { return this._price_order; }
  get stop_price() { return this._stop_price; }
  get status() { return this._status; }
  get filled_quantity() { return this._filled_quantity; }
  get avg_filled_price() { return this._avg_filled_price; }
  get fees() { return this._fees; }
  get created_at() { return this._created_at; }
  get executed_at() { return this._executed_at; }

  // ───── SETTERS ─────
  set code_ticker(value) { this._code_ticker = value; }
  set order_type(value) { this._order_type = value; }
  set order_kind(value) { this._order_kind = value; }
  set quantity(value) { this._quantity = value; }
  set price_order(value) { this._price_order = value; }
  set stop_price(value) { this._stop_price = value; }
  set status(value) { this._status = value; }
  set filled_quantity(value) { this._filled_quantity = value; }
  set avg_filled_price(value) { this._avg_filled_price = value; }
  set fees(value) { this._fees = value; }
  set executed_at(value) { this._executed_at = value; }

  // ───── UTILS ─────
  toJSON() {
    return {
      id: this._id,
      code_ticker: this._code_ticker,
      order_type: this._order_type,
      order_kind: this._order_kind,
      quantity: this._quantity,
      price_order: this._price_order,
      stop_price: this._stop_price,
      status: this._status,
      filled_quantity: this._filled_quantity,
      avg_filled_price: this._avg_filled_price,
      fees: this._fees,
      created_at: this._created_at,
      executed_at: this._executed_at
    };
  }
}

module.exports = MarketOrder;
