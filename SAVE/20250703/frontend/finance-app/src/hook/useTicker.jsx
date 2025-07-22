import { createContext, useContext, useState } from "react";

export const TickerContext = createContext({
    period: "AIR.PA",
    changeTicker: () => {}
});

export function useTicker() {
    return useContext(TickerContext);
}

export function TickerContextProvider ({children}) {
    const [ticker, setTicker] = useState("AIR.PA");
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