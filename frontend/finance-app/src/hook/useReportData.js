import { useEffect, useRef, useState } from "react";
import { addTickerScore, getCurrent, getDescription, getKpiBollinger, getKpiMacd,
    getKpiRsi, getKpiSma, getSector, getTickersScoreWithDay} from "../utils/requests";
import { getDay, getYesterday } from "../utils/day";
import { computeScore } from "../utils/score";
import { useAuthentification } from "./useAuthentication";

const CACHE_DATA_KEY = "reportDataCache";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 1 jour par exemple

export function useReportData (tickersList, reloadProp, limit = 1) {
    const [reportData, setReportData] = useState([]);
    const [offset, setOffset] = useState(0);
    const { isAuthenticated } = useAuthentification();
    const isFetchingRef = useRef(false);                // eviter de charger plusieurs fois le même ticker
    const cacheRef = useRef({
        date: null,                 // date de la donnée
        tickersListSnapshot: [],    // copie brute de tickersList
        data: []                    // données enrichie pour l'affichage dans la tableau
    });

    useEffect(() => {
        const storedCache = localStorage.getItem(CACHE_DATA_KEY);

        if (storedCache) {
            try {
                const parsed = JSON.parse(storedCache);
                const now = Date.now();
                if (!parsed.timestamp || now - parsed.timestamp > CACHE_TTL_MS) {
                    localStorage.removeItem(CACHE_KEY);
                } else {
                    cacheRef.current = parsed.data;
                }
            } catch (err) {
                console.error("Erreur lecture cache localStorage", err);
            }
        }
    }, []);

    // Sauvegarde du cache à chaque modification
    const saveCache = () => {
        try {
            localStorage.setItem(CACHE_DATA_KEY, JSON.stringify({data : cacheRef.current, timestamp: Date.now()}));
        } catch (err) {
            console.error("Erreur sauvegarde cache localStorage", err);
        }
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
            const cachedCodes = new Set(cacheRef.current.tickersListSnapshot.map(t => t.code));
            const currentCodes = new Set(tickersList.map(t => t.code));

            if (cachedCodes.size !== currentCodes.size) return true;

            for (let code of cachedCodes) {
                if (!currentCodes.has(code)) return true;
            }

            return false;
        })();
        
        if (!cacheRef.current.date || cacheRef.current.date !== today || tickersListChanged) {            
            cacheRef.current = {
                date: today,
                tickersListSnapshot: [...tickersList],
                data: []
            };
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

                    // si je trouve dans le cache le ticker en question
                    let cachedTicker = cacheRef.current.data.find((t) => t.code === ticker.code);
                    if (cachedTicker) {
                        result.push(cachedTicker);
                        continue;
                    }

                    // si je ne trouve rien dans le cache
                    // Je regarde dans la BDD s'il y a des données pour le ticker en question (aujourd'hui et hier)
                    let tScoreToday = tickersScoreForTheDay.filter((elt) => elt.code == ticker.code)[0]
                    let tScoreYesterday = tickersScoreForYesterday.filter((elt) => elt.code == ticker.code)[0]

                    // variables pour mes données
                    var dataKpiSma = null;
                    var dataKpiBollinger = null;
                    var dataKpiMacd = null;
                    var dataKpiRsi = null;

                    // les données dont j'ai besoin dans tous les cas 
                    var dataCurrent = await getCurrent(ticker.code);
                    var dataSector = await getSector(ticker.code);
                    var dataDescription = await getDescription(ticker.code);

                    // si on a trouvé un enregistrement dans la BDD du jour
                    if (tScoreToday) {
                        try {
                            dataKpiSma = tScoreToday.mm;
                            dataKpiBollinger = tScoreToday.bollinger;
                            dataKpiMacd = tScoreToday.macd;
                            dataKpiRsi = tScoreToday.rsi;
                        }
                        catch (err) {
                            console.error(`Erreur lors du chargement des informations pour ${ticker.code}`, err);
                        }
                    }

                    // S'il n'y a aucun enregistrement pour le ticker dans la BDD pour la date en question (journée)
                    else {
                        try {
                            // récupération des données via l'API
                            dataKpiSma = await getKpiSma(ticker.code);
                            dataKpiBollinger = await getKpiBollinger(ticker.code);
                            dataKpiMacd = await getKpiMacd(ticker.code);
                            dataKpiRsi = await getKpiRsi(ticker.code);
                        } 
                        catch (error) {
                            console.error(`Erreur lors du chargement des KPI pour ${ticker.code}`, error);
                        }
                    }

                    // calcul du score du ticker
                    let scoreComputed = computeScore(dataKpiSma, dataKpiMacd, dataKpiBollinger, dataKpiRsi);

                    // A cette etape, on a récupéré toutes les données nécessaires et disponibles à mon tableau pour mon ticker

                    const tickerData = {
                        code: ticker.code,
                        name: ticker.name,
                        sector: dataSector,
                        description: dataDescription,
                        current: dataCurrent,
                        sma: dataKpiSma,
                        smaYesterday: tScoreYesterday?.mm ?? null,
                        bollinger: dataKpiBollinger,
                        bollingerYesterday: tScoreYesterday?.bollinger ?? null,
                        rsi: dataKpiRsi,
                        rsiYesterday: tScoreYesterday?.rsi ?? null,
                        macd: dataKpiMacd,
                        macdYesterday: tScoreYesterday?.macd ?? null,
                        score: scoreComputed,
                        scoreYesterday: tScoreYesterday?.score ?? null,
                        is_active: ticker.is_active
                    };

                    // ajout au tableau pour affichage
                    result.push(tickerData);
                    // ajout au cache
                    cacheRef.current.data.push(tickerData); 
                    // sauvegarde dans le cache
                    saveCache();

                    // enregistrement en BDD
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

    return { reportData, setReportData, offset, setOffset };
}