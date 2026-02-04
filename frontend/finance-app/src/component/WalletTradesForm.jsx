import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";

function WalletTradesForm({ orders }) {
    const [formData, setFormData] = React.useState({
        code_ticker: '',
        trade_type: '',
        order_id: null,
        quantity: 0,
        price_trade: 0,
        fees: 0,
        executed_at: null,
    });
    const [availableOrders, setAvailableOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [uniqueTickers, setUniqueTickers] = useState([]);

    // Récupère les tickers uniques depuis les ordres
    useEffect(() => {
        const tickers = [...new Set(orders.map(order => order.code_ticker))];
        setUniqueTickers(tickers);
    }, [orders]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'quantity' || name === 'price_trade' || name === 'fees') {
            if (value < 0) return; // Empêche les valeurs négatives
            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setFormData(prevData => ({
                    ...prevData,
                    [name]: value === '' ? 0 : Number(value)
                }));
            }
            return;
        }
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleOrderSelect = (order) => {
        setSelectedOrder(order);
        setFormData(prevData => ({
            ...prevData,
            order_id: order.id,
            trade_type: order.order_type,
            quantity: order.quantity,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    useEffect(() => {
        if (formData.code_ticker) {
            const data = orders.filter(order => order.code_ticker === formData.code_ticker);
            if (data.length === 0) {
                console.warn('No orders found for ticker:', formData.code_ticker);
                setAvailableOrders([]);
                setSelectedOrder(null);
                return;
            }
            setAvailableOrders(data);
            // Si un seul ordre, on le sélectionne automatiquement
            if (data.length === 1) {
                handleOrderSelect(data[0]);
            } else {
                // Sinon, on laisse l'utilisateur choisir
                setSelectedOrder(null);
                setFormData(prevData => ({
                    ...prevData,
                    order_id: null,
                    trade_type: '',
                    quantity: 0,
                }));
            }
        }
    }, [formData.code_ticker]);

    return (
        <Grid container color='text.primary'>
            <form onSubmit={handleSubmit}>
                <h2>Market Trades</h2>

                <label>
                    Ticker Code:
                    <select
                        name="code_ticker"
                        value={formData.code_ticker}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a ticker</option>
                        {uniqueTickers.map(ticker => (
                            <option key={ticker} value={ticker}>
                                {ticker}
                            </option>
                        ))}
                    </select>
                </label>
                <br />

                {availableOrders.length > 0 && (
                    <>
                        <label>Available Orders:</label>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {availableOrders.map(order => (
                                <li key={order.id} style={{ margin: '5px 0', padding: '5px', border: '1px solid #ccc', cursor: 'pointer' }}
                                    onClick={() => handleOrderSelect(order)}>
                                    Order #{order.id} - {order.order_type} {order.quantity} @ {order.price_order || 'Market'}
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {selectedOrder && (
                    <>
                        <label>
                            Order Id:
                            <input
                                type="number"
                                name="order_id"
                                value={formData.order_id}
                                onChange={handleChange}
                                readOnly
                            />
                        </label>
                        <br />

                        <label>
                            Trade Type:
                            <input
                                type="text"
                                value={formData.trade_type}
                                readOnly
                            />
                        </label>
                        <br />

                        <label>
                            Quantity:
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                            />
                        </label>
                        <br />

                        <label>
                            Price Trade:
                            <input
                                type="number"
                                name="price_trade"
                                value={formData.price_trade}
                                onChange={handleChange}
                            />
                        </label>
                        <br />

                        <label>
                            Fees:
                            <input
                                type="number"
                                name="fees"
                                value={formData.fees}
                                onChange={handleChange}
                            />
                        </label>
                        <br />

                        <label>
                            Executed At:
                            <input
                                type="datetime-local"
                                name="executed_at"
                                value={formData.executed_at}
                                onChange={handleChange}
                            />
                        </label>
                        <br />
                        <button type="submit">Submit Trade</button>
                    </>
                )}
            </form>
        </Grid>
    );
}

export default WalletTradesForm;