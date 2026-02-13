import { createContext, useContext, useEffect, useState } from "react";
import { useTickersList } from "./useTickerList";
import { averageBuyDateByCode, averageBuyPriceByCode, currentValueByCode, getCurrent, profitLossByCode, quantityHeldByCode } from "../utils/requests";

export const WalletContext = createContext({
    wallet: null,
    changeWallet: () => {},
    isLoadingWallet: true
});

export function useWallet() {
    return useContext(WalletContext);
}

export function WalletContextProvider({ children }) {
    const [wallet, setWallet] = useState(null); // null pour savoir si on a déjà initialisé
    const { tickersList } = useTickersList();
    const [isLoadingWallet, setIsLoadingWallet] = useState(true);

    useEffect(() => {
        let fetchWalletData = async () => {
            try {          
                if (tickersList.length > 0 && wallet == null) {
                    let initialWallet = {}; // choisit le premier ticker réel
                    for (const ticker of tickersList) {
                        if (ticker.is_active) {
                            const [
                                current,
                                quantityHeld,
                                currentValue,
                                averageBuyPrice,
                                averageBuyDate
                            ] = await Promise.all([
                                getCurrent(ticker.code),
                                quantityHeldByCode(ticker.code),
                                currentValueByCode(ticker.code),
                                averageBuyPriceByCode(ticker.code),
                                averageBuyDateByCode(ticker.code)
                            ]);

                            const profitLoss = await profitLossByCode(ticker.code, current);

                            initialWallet[ticker.code] = {
                                quantityHeld: quantityHeld ?? 0,
                                currentValue: currentValue ?? 0,
                                profitLoss: profitLoss ?? 0,
                                averageBuyPrice: averageBuyPrice ?? 0,
                                averageBuyDate: averageBuyDate ?? 0,
                                current: current ?? 0
                            };
                        }
                    };
                    setWallet(initialWallet);
                }
            } catch (error) {
                console.error("Error initializing wallet:", error);
            } finally {
                setIsLoadingWallet(false);
            }
        }

        fetchWalletData();
    }, [tickersList, wallet]);

    // Met à jour le wallet (ex: après un achat/vente)
    const changeWallet = (newWallet) => {
        setWallet(prev => ({ ...prev, ...newWallet }));
    };

    return (
        <WalletContext.Provider value={{ 
            wallet, 
            changeWallet,
            isLoadingWallet
        }}>
            {children}
        </WalletContext.Provider>
    );
}