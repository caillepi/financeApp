import { createContext, useContext, useEffect, useState } from "react";
import { useTickersList } from "./useTickerList";
import { minTime } from "date-fns/constants";

export const TickerContext = createContext({
    ticker: null,
    changeTicker: () => {}
});

export function useTicker() {
    return useContext(TickerContext);
}

export function TickerContextProvider({ children }) {
    const [ticker, setTicker] = useState(null); // null pour savoir si on a déjà initialisé
    const { tickersList } = useTickersList();
    const [tickerByDefault, setTickerByDefault] = useState(false);

    useEffect(() => {
        if (tickersList.length > 0 && (ticker === null || tickerByDefault)) {
            setTicker(tickersList[0].code); // choisit le premier ticker réel
            setTickerByDefault(false);
        }
        else if (tickersList.length === 0 && ticker === null) {
            setTicker("CS.PA"); // fallback si liste vide
            setTickerByDefault(true);
        }
    }, [tickersList, ticker]);

    const changeTicker = (newTicker) => {
        setTicker(newTicker);
        setTickerByDefault(false);
    };

    return (
        <TickerContext.Provider value={{ 
            ticker, 
            changeTicker
        }}>
            {children}
        </TickerContext.Provider>
    );
}