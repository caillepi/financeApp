import { createContext, useContext, useState } from "react";

export const PeriodContext = createContext({
    period: "ONE_YEAR",
    changePeriod: () => {}
});

export function usePeriod() {
    return useContext(PeriodContext);
}

export function PeriodContextProvider ({children}) {
    const [period, setPeriod] = useState("ONE_YEAR");
    const changePeriod = (period) => {
        setPeriod(period);
    }

    return <>
        <PeriodContext.Provider value={{
            period,
            changePeriod
        }}>
            {children}
        </PeriodContext.Provider>
    </>
}