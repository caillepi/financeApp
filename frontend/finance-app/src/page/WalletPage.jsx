import React, { use, useEffect, useState } from "react";
import { useNavigation } from "../hook/useNavigation";
import { useAuthentification } from "../hook/useAuthentication";
import { getMarketOrders, getMarketTrades } from "./../utils/requests.js";
import { useTickersList } from "../hook/useTickerList.jsx";
import './WalletPage.css';
import { useWallet } from "../hook/useWallet.jsx";
import WalletOrdersForm from "../component/WalletOrdersForm.jsx";
import WalletTradesForm from "../component/WalletTradesForm.jsx";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function WalletPage () {
    const [marketOrders, setMarketOrders] = useState(null);
    const [marketTrades, setMarketTrades] = useState(null);
    const { wallet, isLoadingWallet } = useWallet();
    const { tickersList } = useTickersList();
    const { navigate } = useNavigation();
    const { isAuthenticated } = useAuthentification();

    // modale formulaire
    const [openOrderModal, setOpenOrdersModal] = useState(false);
    const [openTradesModal, setOpenTradesModal] = useState(false);

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

    // Style de la modale
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

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

            {/* Bouton pour ouvrir la modale */}
            <Button
                variant="contained"
                onClick={() => setOpenOrdersModal(true)}
                style={{ margin: '20px 0' }}
            >
                Ajouter un ordre
            </Button>

            <Button
                variant="contained"
                onClick={() => setOpenTradesModal(true)}
                style={{ margin: '20px 20px' }}
            >
                Ajouter un trade
            </Button>

            <Modal
                open={openOrderModal}
                onClose={() => setOpenOrdersModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <WalletOrdersForm onClose={() => setOpenOrdersModal(false)} />
                </Box>
            </Modal>

            <Modal
                open={openTradesModal}
                onClose={() => setOpenTradesModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <WalletTradesForm 
                        orders={marketOrders}
                        onClose={() => setOpenTradesModal(false)} />
                </Box>
            </Modal>
        </div>
    </>
}

export default WalletPage;