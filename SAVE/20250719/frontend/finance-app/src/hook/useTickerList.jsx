import { createContext, useContext, useEffect, useState } from "react";
import { getTickers } from "../utils/requests";

export const TickersListContext = createContext({
    tickerList: [],
    changeTickersList: () => {}
});

export function useTickersList() {
    return useContext(TickersListContext);
}

export function TickersListContextProvider ({children}) {
    const [tickersList, setTickersList] = useState([]);
    const changeTickersList = (tickersList) => {
        setTickersList(tickersList);
    }

    useEffect(() => {
        let fetchData = async () => {
            setTickersList(await getTickers())
        }

        fetchData();
    }, []);

    return <>
        <TickersListContext.Provider value={{
            tickersList,
            changeTickersList
        }}>
            {children}
        </TickersListContext.Provider>
    </>
}