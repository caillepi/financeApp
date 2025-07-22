import { createContext, useContext, useState } from "react";

export const ChartContext = createContext({
    chart: "CLOSE_CHART",
    changeChart: () => {}
});

export function useChart() {
    return useContext(ChartContext);
}

export function ChartContextProvider({children}) {
    const [chart, setChart] = useState("CLOSE_CHART");
    const changeChart = (_chart) => {
        setChart(_chart)
    }

    return <>
        <ChartContext.Provider value={{
            chart,
            changeChart
        }}>
            {children}
        </ChartContext.Provider>
    </>
}