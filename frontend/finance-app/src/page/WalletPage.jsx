import React, { use, useEffect, useState } from "react";
import { useNavigation } from "../hook/useNavigation";
import { useAuthentification } from "../hook/useAuthentication";
import { getMarketOrders, getMarketTrades } from "./../utils/requests.js";
import { useTickersList } from "../hook/useTickerList.jsx";
import './WalletPage.css';
import { useWallet } from "../hook/useWallet.jsx";

function WalletPage () {
    const [marketOrders, setMarketOrders] = useState(null);
    const [marketTrades, setMarketTrades] = useState(null);
    const { wallet, isLoadingWallet } = useWallet();
    const { tickersList } = useTickersList();
    const { navigate } = useNavigation();
    const { isAuthenticated } = useAuthentification();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        let fetchData = async () => {
            try {
                setMarketOrders(await getMarketOrders());
                setMarketTrades(await getMarketTrades());
            }
            catch (error) {
                console.error('Error fetching market orders:', error);
            }
        };

        fetchData();
     }, []);

    if (!isAuthenticated) {
        // Pendant que la redirection s’effectue, on ne rend rien
        return null;
    }

    if (isLoadingWallet || marketOrders === null || marketTrades === null) { 
        return <div>Loading...</div>;
    }

    return <>
        <div id="walletpage">
            <table id="wallet-table">
                <thead className="wallet-thead">
                    <tr className="wallet-tr">
                        <th className="wallet-th">Ticker</th>
                        <th className="wallet-th">Quantity Held</th>
                        <th className="wallet-th">Average Buy Price</th>
                        <th className="wallet-th">Current Value</th>
                        <th className="wallet-th">Profit/Loss</th>
                        <th className="wallet-th">Last Price</th>
                        <th className="wallet-th">Average Buy Date</th>
                    </tr>
                </thead>
                <tbody>
                    {tickersList.map((ticker) => (
                        ticker.is_active &&
                        <tr key={ticker.code}>
                            <td className="wallet-td">{ticker.name} ({ticker.code})</td>
                            <td className="wallet-td">{wallet && wallet[ticker.code] ? wallet[ticker.code].quantityHeld.toFixed(0) : 'N/A'}</td>
                            <td className="wallet-td">{wallet && wallet[ticker.code] ? wallet[ticker.code].averageBuyPrice.toFixed(2) : 'N/A'} EUR</td>
                            <td className="wallet-td">{wallet && wallet[ticker.code] ? wallet[ticker.code].currentValue.toFixed(2) : 'N/A'} EUR</td>
                            <td className={`wallet-td ${wallet && wallet[ticker.code] && wallet[ticker.code].profitLoss >= 0 ? 'profit' : 'loss'}`}>{wallet && wallet[ticker.code] ? wallet[ticker.code].profitLoss.toFixed(2) : 'N/A'} EUR</td>
                            <td className="wallet-td">{wallet && wallet[ticker.code] ? wallet[ticker.code].current.toFixed(2) : 'N/A'} EUR</td>
                            <td className="wallet-td">{wallet && wallet[ticker.code] ? new Date(wallet[ticker.code].averageBuyDate).toLocaleDateString() : 'N/A'}</td>   
                        </tr>
                    ))}
                </tbody> 
            </table>
        </div>
    </>
}

export default WalletPage