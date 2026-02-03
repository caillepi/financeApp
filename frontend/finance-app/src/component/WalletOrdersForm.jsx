import React from "react";

function WalletOrdersForm() {
    const [formData, setFormData] = React.useState({
        code_ticker: '',
        order_type: '',
        order_kind: '',
        quantity: 0,
        price_order: 0,
        stop_price: 0,
        status: '',
        filled_quantity: 0,
        avg_filled_price: 0,
        fees: 0,
        created_at: new Date().toISOString(),
        executed_at: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'quantity' || name === 'price_order' || name === 'stop_price' || name === 'filled_quantity' || name === 'avg_filled_price' || name === 'fees') {
            if (value < 0) return; // Empêche les valeurs négatives
            if (!/^\d+$/.test(value)) return; // N’accepte que les chiffres
        }
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique pour soumettre le formulaire
        console.log('Form submitted:', formData);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Market Orders</h2>
                {/* Form fields for market orders go here */}

                <label>Ticker Code:
                    <input 
                        type="text" 
                        name="code_ticker" 
                        value={formData.code_ticker} 
                        onChange={handleChange} 
                    />
                </label>
                <br />

                <label>Order Type:
                    <select 
                        name="order_type" 
                        value={formData.order_type} 
                        onChange={handleChange}
                    >
                        <option value="">Select Type</option>
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                    </select>
                </label>
                <br />

                <label>Order Kind:
                    <select 
                        name="order_kind"
                        value={formData.order_kind} 
                        onChange={handleChange}
                    >
                        <option value="">Select Kind</option>
                        <option value="market">Market</option>
                        <option value="limit">Limit</option>
                        <option value="stop">Stop</option>
                        <option value="stop_limit">Stop Limit</option>
                    </select>
                </label>
                <br />

                <label>Quantity:
                    <input 
                        type="number" 
                        name="quantity" 
                        value={formData.quantity} 
                        onChange={handleChange} 
                    />
                </label>
                <br />

                <label>Price Order:
                    <input 
                        type="number" 
                        name="price_order" 
                        value={formData.price_order} 
                        onChange={handleChange} 
                    />
                </label>
                <br />

                <label>Stop Price:
                    <input 
                        type="number" 
                        name="stop_price" 
                        value={formData.stop_price} 
                        onChange={handleChange} 
                    />
                </label>
                <br />

                <label>Status:
                    <input 
                        type="text" 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange} 
                    />
                </label>
                <br />

                <label>Filled Quantity:
                    <input 
                        type="number" 
                        name="filled_quantity" 
                        value={formData.filled_quantity} 
                        onChange={handleChange} 
                    />
                </label>
                <br />

                <label>Average Filled Price:
                    <input 
                        type="number" 
                        name="avg_filled_price" 
                        value={formData.avg_filled_price} 
                        onChange={handleChange} 
                    />
                </label>
                <br />

                <label>Fees:
                    <input 
                        type="number" 
                        name="fees" 
                        value={formData.fees} 
                        onChange={handleChange} 
                    />
                </label>
                <br />

                <label>Executed At:
                    <input 
                        type="datetime-local" 
                        name="executed_at" 
                        value={formData.executed_at || ''}
                        onChange={handleChange} 
                    />
                </label>

                <button type="submit">Submit Order</button>
            </form>
        </div>
    );
}

export default WalletOrdersForm;