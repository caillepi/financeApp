import { createContext, useContext, useEffect, useState } from "react";
import { getTickers } from "../utils/requests";
import { useAuthentification } from "./useAuthentication";

export const TickersListContext = createContext({
    tickersList: [],
    changeTickersList: () => {}
});

export function useTickersList() {
    return useContext(TickersListContext);
}

export function TickersListContextProvider ({children}) {
    const [tickersList, setTickersList] = useState([]);
    const { isAuthenticated } = useAuthentification();

    const changeTickersList = (tickersList) => {
        setTickersList(tickersList);
    }

    useEffect(() => {
        let ignore = false;

        let fetchData = async () => {
            // si pas connecte ou deconnexion
            if (!isAuthenticated) {
                setTickersList([]);
                return;
            }

            if (isAuthenticated) {
                try {
                    let data = await getTickers();
                    if (!ignore) {
                        setTickersList(data);
                    }
                }
                catch (err) {
                    console.error("Erreur lors du chargement des tickers :", err);
                }
            }
        }

        fetchData();

        return () => {
            ignore = true;
        };
    }, [isAuthenticated]);

    return <>
        <TickersListContext.Provider value={{
            tickersList,
            changeTickersList
        }}>
            {children}
        </TickersListContext.Provider>
    </>
}