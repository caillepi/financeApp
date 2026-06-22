import { createContext, useContext, useEffect, useRef, useState } from "react";
import { addTickerScore, getCurrent, getDescription, getLow, getHigh, getLastOpen, getLastClose, getKpiBollinger, getKpiMacd,
    getKpiRsi, getKpiSma, getSector, getTickersScoreWithDay, getAverageAnalystRating} from "../utils/requests";
import { getDay, getYesterday } from "../utils/day";
import { computeScore } from "../utils/score";
import { useAuthentification } from "./useAuthentication";

const STATIC_CACHE_KEY = "reportStaticCache";
const DYNAMIC_CACHE_KEY = "reportDynamicCache";
const DYNAMIC_CACHE_TTL_MS = 1000 * 60 * 60; // 1 heure par exemple
// const CACHE_TTL_MS = 1000; // 1 seconde par exemple

export const ReportDataContext = createContext({
    reportData: null,
    changeReportData: () => {},
    offset: null,
    changeOffset: () => {}
});

export function useReportData() {
    return useContext(ReportDataContext);
}

export function ReportDataContextProvider ({children, tickersList, reloadProp = false, limit = 1}) {
    const [reportData, setReportData] = useState([]);
    const [offset, setOffset] = useState(0);
    const [cacheReady, setCacheReady] = useState(false);
    const { isAuthenticated } = useAuthentification();
    const isFetchingRef = useRef(false);                // eviter de charger plusieurs fois le même ticker
    const staticCacheRef = useRef({
        date: null,
        tickersListSnapshot: [],
        data: {} // map code -> { name, sector, description, is_active }
    });

    const dynamicCacheRef = useRef({
        // per-code dynamic entries with timestamp
        data: {} // map code -> { current, sma, bollinger, macd, rsi, score, timestamp }
    });

    const isDynamicEntryValid = (dynamicEntry) => {
        return dynamicEntry && (Date.now() - (dynamicEntry.timestamp || 0) <= DYNAMIC_CACHE_TTL_MS);
    };

    const buildCachedReportData = () => {
        if (!tickersList.length) return [];

        return tickersList.map((ticker) => {
            const staticEntry = staticCacheRef.current.data[ticker.code];
            const dynamicEntry = dynamicCacheRef.current.data[ticker.code];
            if (!isDynamicEntryValid(dynamicEntry)) return null;

            return {
                code: ticker.code,
                name: staticEntry?.name || ticker.name,
                sector: staticEntry?.sector || null,
                description: staticEntry?.description || null,
                current: dynamicEntry.current,
                low: dynamicEntry.low,
                high: dynamicEntry.high,
                lastOpen: dynamicEntry.lastOpen,
                lastClose: dynamicEntry.lastClose,
                sma: dynamicEntry.sma,
                bollinger: dynamicEntry.bollinger,
                macd: dynamicEntry.macd,
                rsi: dynamicEntry.rsi,
                averageAnalystRating: dynamicEntry.averageAnalystRating,
                score: dynamicEntry.score,
                smaYesterday: null,
                bollingerYesterday: null,
                rsiYesterday: null,
                macdYesterday: null,
                scoreYesterday: null,
                is_active: ticker.is_active
            };
        }).filter(Boolean);
    };

    useEffect(() => {
        try {
            const storedStatic = localStorage.getItem(STATIC_CACHE_KEY);
            if (storedStatic) {
                staticCacheRef.current = JSON.parse(storedStatic);
            }
        } catch (err) { console.error('Erreur lecture static cache', err); }

        try {
            const storedDynamic = localStorage.getItem(DYNAMIC_CACHE_KEY);
            if (storedDynamic) {
                dynamicCacheRef.current = JSON.parse(storedDynamic);
            }
        } catch (err) { console.error('Erreur lecture dynamic cache', err); }

        setCacheReady(true);
    }, []);

    useEffect(() => {
        if (!cacheReady) return;
        if (!tickersList.length) return;
        if (reportData.length > 0) return;

        const cachedReportData = buildCachedReportData();
        if (cachedReportData.length > 0) {
            setReportData(cachedReportData);
        }
    }, [cacheReady, tickersList, reportData.length]);

    // Sauvegarde du cache à chaque modification
    const saveCache = () => {
        try {
            localStorage.setItem(STATIC_CACHE_KEY, JSON.stringify(staticCacheRef.current));
        } catch (err) { console.error('Erreur sauvegarde static cache', err); }

        try {
            localStorage.setItem(DYNAMIC_CACHE_KEY, JSON.stringify(dynamicCacheRef.current));
        } catch (err) { console.error('Erreur sauvegarde dynamic cache', err); }
    };

    // pour le premier chargement OU
    // Reset offset et données si tickersList ou reloadProp change
    useEffect(() => {
        // si tickersList est vide, on ne peut rien faire
        if (tickersList.length === 0) return;

        // date du jour
        const today = getDay();
        
        // Si cache invalide ou liste des tickers modifiée, on reset
        // comparaison de deux tableaux : 
        // - cacheRef.current.tickersListSnapshot
        // - tickersList
        // Si un code à changer entre la liste des tickers actuels et ce que l'on a enregistré dans la ref -> TRUE
        // sinon, pas de changement -> FALSE
        const tickersListChanged = (() => {
            const cachedCodes = new Set(staticCacheRef.current.tickersListSnapshot.map(t => t.code));
            const currentCodes = new Set(tickersList.map(t => t.code));

            if (cachedCodes.size !== currentCodes.size) return true;

            for (let code of cachedCodes) {
                if (!currentCodes.has(code)) return true;
            }

            return false;
        })();
        
        if (!staticCacheRef.current.date || staticCacheRef.current.date !== today || tickersListChanged) {
            // reset static cache (we keep dynamic cache separate)
            staticCacheRef.current = {
                date: today,
                tickersListSnapshot: [...tickersList],
                data: {}
            };
            // reset dynamic cache as well since ticker list changed
            dynamicCacheRef.current = { data: {} };
            saveCache();

            setOffset(0);
            setReportData([]);
        }
    }, [tickersList, reloadProp]);

    // pour le second chargement et après (déplacement de l'offset)
    useEffect(() => {
        // si l'utilisateur n'est pas connecté
        if (!isAuthenticated) return;
        // si tickersList est vide, on ne peut rien faire
        if (tickersList.length === 0) return;
        // si toujours en train de charger le ticker précédent pour éviter de faire plusieurs fois le même
        if (isFetchingRef.current) return;

        isFetchingRef.current = true;

        const fetchData = async () => {
            try {
                let result = [];                    // données à afficher

                const today = getDay();             // aujourd'hui
                const yesterday = getYesterday();   // hier

                // je recupere les tickers de la BDD pour aujourd'hui et hier
                let tickersScoreForTheDay = await getTickersScoreWithDay(today);            // aujourd'hui
                let tickersScoreForYesterday = await getTickersScoreWithDay(yesterday);     // hier
                
                // je parcours la liste des tickers dans tickersList
                for (let i = offset; (i < offset + limit) && (i < tickersList.length); i++) {
                    const ticker = tickersList[i];
                    // try to use separated caches: static + dynamic
                    const staticEntry = staticCacheRef.current.data[ticker.code];
                    const dynamicEntry = dynamicCacheRef.current.data[ticker.code];
                    const now = Date.now();
                    const dynamicValid = dynamicEntry && (now - (dynamicEntry.timestamp || 0) <= DYNAMIC_CACHE_TTL_MS);

                    // if both present and dynamic fresh, use them
                    if (staticEntry && dynamicValid) {
                        result.push({
                            code: ticker.code,
                            name: staticEntry.name || ticker.name,
                            sector: staticEntry.sector,
                            description: staticEntry.description,
                            current: dynamicEntry.current,
                            low: dynamicEntry.low,
                            high: dynamicEntry.high,
                            lastOpen: dynamicEntry.lastOpen,
                            lastClose: dynamicEntry.lastClose,
                            sma: dynamicEntry.sma,
                            smaYesterday: (tickersScoreForYesterday.filter((elt) => elt.code == ticker.code)[0])?.mm ?? null,
                            bollinger: dynamicEntry.bollinger,
                            bollingerYesterday: (tickersScoreForYesterday.filter((elt) => elt.code == ticker.code)[0])?.bollinger ?? null,
                            rsi: dynamicEntry.rsi,
                            rsiYesterday: (tickersScoreForYesterday.filter((elt) => elt.code == ticker.code)[0])?.rsi ?? null,
                            macd: dynamicEntry.macd,
                            macdYesterday: (tickersScoreForYesterday.filter((elt) => elt.code == ticker.code)[0])?.macd ?? null,
                            averageAnalystRating: dynamicEntry.averageAnalystRating,
                            score: dynamicEntry.score,
                            scoreYesterday: (tickersScoreForYesterday.filter((elt) => elt.code == ticker.code)[0])?.score ?? null,
                            is_active: ticker.is_active
                        });
                        continue;
                    }

                    // otherwise fetch missing parts
                    const [dataCurrent, dataLow, dataHigh, dataLastOpen, dataLastClose, dataSector, dataDescription, dataAverageAnalystRating] = await Promise.all([
                        getCurrent(ticker.code),
                        getLow(ticker.code),
                        getHigh(ticker.code),
                        getLastOpen(ticker.code),
                        getLastClose(ticker.code),
                        staticEntry ? Promise.resolve(staticEntry.sector) : getSector(ticker.code),
                        staticEntry ? Promise.resolve(staticEntry.description) : getDescription(ticker.code),
                        getAverageAnalystRating(ticker.code)
                    ]);

                    // persist static info if missing
                    if (!staticEntry) {
                        staticCacheRef.current.data[ticker.code] = {
                            name: ticker.name,
                            sector: dataSector,
                            description: dataDescription,
                            is_active: ticker.is_active
                        };
                        staticCacheRef.current.tickersListSnapshot = [...tickersList];
                        staticCacheRef.current.date = today;
                    }

                    // dynamic KPIs: use DB scores if present otherwise compute via API
                    let tScoreToday = tickersScoreForTheDay.filter((elt) => elt.code == ticker.code)[0];
                    let dataKpiSma = null, dataKpiBollinger = null, dataKpiMacd = null, dataKpiRsi = null;
                    if (tScoreToday) {
                        dataKpiSma = tScoreToday.mm;
                        dataKpiBollinger = tScoreToday.bollinger;
                        dataKpiMacd = tScoreToday.macd;
                        dataKpiRsi = tScoreToday.rsi;
                    } else {
                        try {
                            dataKpiSma = await getKpiSma(ticker.code);
                            dataKpiBollinger = await getKpiBollinger(ticker.code);
                            dataKpiMacd = await getKpiMacd(ticker.code);
                            dataKpiRsi = await getKpiRsi(ticker.code);
                        } catch (error) {
                            console.error(`Erreur lors du chargement des KPI pour ${ticker.code}`, error);
                        }
                    }

                    const scoreComputed = computeScore(dataKpiSma, dataKpiMacd, dataKpiBollinger, dataKpiRsi);

                    // store dynamic
                    dynamicCacheRef.current.data[ticker.code] = {
                        current: dataCurrent,
                        low: dataLow,
                        high: dataHigh,
                        lastOpen: dataLastOpen,
                        lastClose: dataLastClose,
                        sma: dataKpiSma,
                        bollinger: dataKpiBollinger,
                        macd: dataKpiMacd,
                        rsi: dataKpiRsi,
                        averageAnalystRating: dataAverageAnalystRating,
                        score: scoreComputed,
                        timestamp: Date.now()
                    };

                    // build final object
                    const tScoreYesterday = tickersScoreForYesterday.filter((elt) => elt.code == ticker.code)[0];
                    const tickerData = {
                        code: ticker.code,
                        name: staticCacheRef.current.data[ticker.code].name || ticker.name,
                        sector: staticCacheRef.current.data[ticker.code].sector,
                        description: staticCacheRef.current.data[ticker.code].description,
                        current: dataCurrent,
                        low: dataLow,
                        high: dataHigh,
                        lastOpen: dataLastOpen,
                        lastClose: dataLastClose,
                        sma: dataKpiSma,
                        smaYesterday: tScoreYesterday?.mm ?? null,
                        bollinger: dataKpiBollinger,
                        bollingerYesterday: tScoreYesterday?.bollinger ?? null,
                        rsi: dataKpiRsi,
                        rsiYesterday: tScoreYesterday?.rsi ?? null,
                        macd: dataKpiMacd,
                        macdYesterday: tScoreYesterday?.macd ?? null,
                        averageAnalystRating: dataAverageAnalystRating,
                        score: scoreComputed,
                        scoreYesterday: tScoreYesterday?.score ?? null,
                        is_active: ticker.is_active
                    };

                    result.push(tickerData);
                    saveCache();

                    // enregistrement en BDD si nécessaire
                    if (!tScoreToday) {
                        await addTickerScore(today,
                            ticker.code,
                            dataKpiSma,
                            dataKpiMacd,
                            dataKpiBollinger,
                            dataKpiRsi,
                            scoreComputed);
                    }
                }

                // on met à jour l'état local reportData
                setReportData(prevData => {
                    // ensemble de tous les codes des tickers SANS doublons (Set)
                    const existingCodes = new Set(prevData.map(item => item.code));
                    // données des tickers pas encore présents dans les données
                    const newData = result.filter(item => !existingCodes.has(item.code));
                    // on ajoute les anciens avec les nouveaux
                    return [...prevData, ...newData];
                });

                // charger la suite uniquement si nécessaire
                if (offset + limit < tickersList.length) {
                    setOffset(prev => prev + limit);
                }
            }
            catch (err) {
                console.error("Error in fetchData in useReportData : ", err);
            }
            finally {
                isFetchingRef.current = false;
            }
        };

        fetchData();
    }, [offset, tickersList, isAuthenticated]);

    const changeReportData = (newReportData) => {
        setReportData(newReportData);
    }

    const changeOffset = (newOffset) => {
        setOffset(newOffset);
    }

    return (
        <ReportDataContext.Provider value={{
            reportData,
            changeReportData,
            offset,
            changeOffset
        }}>
            {children}
        </ReportDataContext.Provider>
    )
}