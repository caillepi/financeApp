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
    const STATIC_CACHE_KEY = "reportStaticCache";
    const DYNAMIC_CACHE_KEY = "reportDynamicCache";
    const DYNAMIC_CACHE_TTL_MS = 1000 * 60 * 60; // 1h

    useEffect(() => {
        if (!ticker) return;
        if (!period) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                // try to use frontend caches to avoid redundant requests
                let cachedStatic = null;
                let cachedDynamic = null;
                try {
                    const s = localStorage.getItem(STATIC_CACHE_KEY);
                    if (s) {
                        const parsed = JSON.parse(s);
                        cachedStatic = parsed.data && parsed.data[ticker] ? parsed.data[ticker] : parsed.data && parsed.data[ticker]?.code ? parsed.data[ticker] : parsed.data && parsed.data[ticker]?.name ? parsed.data[ticker] : null;
                    }
                } catch (e) { cachedStatic = null; }
                try {
                    const d = localStorage.getItem(DYNAMIC_CACHE_KEY);
                    if (d) {
                        const parsed = JSON.parse(d);
                        cachedDynamic = parsed.data && parsed.data[ticker] ? parsed.data[ticker] : null;
                    }
                } catch (e) { cachedDynamic = null; }

                const now = Date.now();
                const dynamicValid = cachedDynamic && (now - (cachedDynamic.timestamp || 0) <= DYNAMIC_CACHE_TTL_MS);

                if (cachedStatic && dynamicValid) {
                    // use cached combined data
                    setData({
                        enterpriseName: cachedStatic.name || cachedStatic.enterpriseName || null,
                        description: cachedStatic.description || null,
                        sector: cachedStatic.sector || null,
                        current: cachedDynamic.current,
                        low: cachedDynamic.low,
                        high: cachedDynamic.high,
                        lastOpen: cachedDynamic.lastOpen,
                        lastClose: cachedDynamic.lastClose,
                        min: cachedDynamic.min,
                        max: cachedDynamic.max,
                        dividend: cachedDynamic.dividend,
                        kpiSma: cachedDynamic.sma,
                        kpiBollinger: cachedDynamic.bollinger,
                        kpiMacd: cachedDynamic.macd,
                        kpiRsi: cachedDynamic.rsi
                    });
                    setLoading(false);
                    return;
                }

                // build requests depending on what is missing
                const reqs = [];
                const mapIndex = {}; // map keys to positions in reqs

                // enterpriseName / description / sector: use cachedStatic if present
                if (!cachedStatic) {
                    mapIndex.enterpriseName = reqs.push(getEnterpriseName(ticker)) - 1;
                    mapIndex.description = reqs.push(getDescription(ticker)) - 1;
                    mapIndex.sector = reqs.push(getSector(ticker)) - 1;
                }

                // dynamic fields: if dynamic invalid, request them
                if (!dynamicValid) {
                    mapIndex.current = reqs.push(getCurrent(ticker)) - 1;
                    mapIndex.low = reqs.push(getLow(ticker)) - 1;
                    mapIndex.high = reqs.push(getHigh(ticker)) - 1;
                    mapIndex.lastOpen = reqs.push(getLastOpen(ticker)) - 1;
                    mapIndex.lastClose = reqs.push(getLastClose(ticker)) - 1;
                    mapIndex.min = reqs.push(getMin(ticker, period)) - 1;
                    mapIndex.max = reqs.push(getMax(ticker, period)) - 1;
                    mapIndex.dividend = reqs.push(getDividend(ticker)) - 1;
                    mapIndex.kpiSma = reqs.push(getKpiSma(ticker)) - 1;
                    mapIndex.kpiBollinger = reqs.push(getKpiBollinger(ticker)) - 1;
                    mapIndex.kpiMacd = reqs.push(getKpiMacd(ticker)) - 1;
                    mapIndex.kpiRsi = reqs.push(getKpiRsi(ticker)) - 1;
                }

                const responses = reqs.length ? await Promise.all(reqs) : [];

                const enterpriseName = cachedStatic ? (cachedStatic.name || cachedStatic.enterpriseName) : (responses[mapIndex.enterpriseName] || null);
                const description = cachedStatic ? cachedStatic.description : (responses[mapIndex.description] || null);
                const sector = cachedStatic ? cachedStatic.sector : (responses[mapIndex.sector] || null);

                const current = dynamicValid ? cachedDynamic.current : (responses[mapIndex.current] || null);
                const low = dynamicValid ? cachedDynamic.low : (responses[mapIndex.low] || null);
                const high = dynamicValid ? cachedDynamic.high : (responses[mapIndex.high] || null);
                const lastOpen = dynamicValid ? cachedDynamic.lastOpen : (responses[mapIndex.lastOpen] || null);
                const lastClose = dynamicValid ? cachedDynamic.lastClose : (responses[mapIndex.lastClose] || null);
                const min = dynamicValid ? cachedDynamic.min : (responses[mapIndex.min] || null);
                const max = dynamicValid ? cachedDynamic.max : (responses[mapIndex.max] || null);
                const dividend = dynamicValid ? cachedDynamic.dividend : (responses[mapIndex.dividend] || null);
                const kpiSma = dynamicValid ? cachedDynamic.sma : (responses[mapIndex.kpiSma] || null);
                const kpiBollinger = dynamicValid ? cachedDynamic.bollinger : (responses[mapIndex.kpiBollinger] || null);
                const kpiMacd = dynamicValid ? cachedDynamic.macd : (responses[mapIndex.kpiMacd] || null);
                const kpiRsi = dynamicValid ? cachedDynamic.rsi : (responses[mapIndex.kpiRsi] || null);
    
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

                // update frontend caches so other hooks can reuse
                try {
                    // static
                    const sRaw = localStorage.getItem(STATIC_CACHE_KEY);
                    const sObj = sRaw ? JSON.parse(sRaw) : { date: null, tickersListSnapshot: [], data: {} };
                    sObj.data = sObj.data || {};
                    sObj.data[ticker] = sObj.data[ticker] || {};
                    sObj.data[ticker].name = enterpriseName || sObj.data[ticker].name;
                    sObj.data[ticker].sector = sector || sObj.data[ticker].sector;
                    sObj.data[ticker].description = description || sObj.data[ticker].description;
                    try { localStorage.setItem(STATIC_CACHE_KEY, JSON.stringify(sObj)); } catch(e){}

                    // dynamic
                    const dRaw = localStorage.getItem(DYNAMIC_CACHE_KEY);
                    const dObj = dRaw ? JSON.parse(dRaw) : { data: {} };
                    dObj.data = dObj.data || {};
                    dObj.data[ticker] = {
                        current,
                        low,
                        high,
                        lastOpen,
                        lastClose,
                        min,
                        max,
                        dividend,
                        sma: kpiSma,
                        bollinger: kpiBollinger,
                        macd: kpiMacd,
                        rsi: kpiRsi,
                        timestamp: Date.now()
                    };
                    try { localStorage.setItem(DYNAMIC_CACHE_KEY, JSON.stringify(dObj)); } catch(e){}
                } catch (e) { /* best-effort */ }
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