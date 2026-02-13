import { useEffect, useState } from "react";
import { getCurrent, getDividend, getEnterpriseName, getHigh, 
    getLastClose, getLastOpen, getLow, getMax, getMin, 
    getKpiBollinger, getKpiMacd, getKpiRsi, getKpiSma, 
    getSector,
    getDescription} 
    from "../utils/requests";

export function useTickerData (ticker, period) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!ticker) return;
        if (!period) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const [
                    enterpriseName,
                    description,
                    sector,
                    current,
                    low,
                    high,
                    lastOpen,
                    lastClose,
                    min,
                    max,
                    dividend,
                    kpiSma,
                    kpiBollinger,
                    kpiMacd,
                    kpiRsi
                ] = await Promise.all([
                    getEnterpriseName(ticker),
                    getDescription(ticker),
                    getSector(ticker),
                    getCurrent(ticker),
                    getLow(ticker),
                    getHigh(ticker),
                    getLastOpen(ticker),
                    getLastClose(ticker),
                    getMin(ticker, period),
                    getMax(ticker, period),
                    getDividend(ticker),
                    getKpiSma(ticker),
                    getKpiBollinger(ticker),
                    getKpiMacd(ticker),
                    getKpiRsi(ticker)
                ]);
    
                setData({
                    enterpriseName,
                    description,
                    sector,
                    current,
                    low,
                    high,
                    lastOpen,
                    lastClose,
                    min,
                    max,
                    dividend,
                    kpiSma,
                    kpiBollinger,
                    kpiMacd,
                    kpiRsi
                });
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }

        };

        fetchData();

    }, [ticker, period]);

    return {data, loading};
}