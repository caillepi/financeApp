import { createContext, useContext, useState } from "react";

export const TickerContext = createContext({
    ticker: "AIR.PA",
    changeTicker: () => {}
});

export function useTicker() {
    return useContext(TickerContext);
}

export function TickerContextProvider ({children}) {
    const [ticker, setTicker] = useState("CS.PA");
    const changeTicker = (ticker) => {
        setTicker(ticker);
    }

    return <>
        <TickerContext.Provider value={{
            ticker,
            changeTicker
        }}>
            {children}
        </TickerContext.Provider>
    </>
}