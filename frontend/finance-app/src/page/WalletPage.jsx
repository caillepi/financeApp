import React, { useEffect, useState } from "react";

function WalletPage () {
    const [marketOrders, setMarketOrders] = useState(null);
    const [marketTrades, setMarketTrades] = useState(null);

    useEffect(() => {
        let fetchData = async () => {
            try {
                let ordersResponse = await fetch('http://localhost:3001/api/marketOrders');
                let ordersData = await ordersResponse.json();
                setMarketOrders(ordersData);}
            catch (error) {
                console.error('Error fetching market orders:', error);
            }
        };

        fetchData();
     }, []);

    return <>
        <div id="walletpage">
            Wallet Page
        </div>
    </>
}

export default WalletPage