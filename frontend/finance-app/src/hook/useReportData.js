import { useEffect, useState } from "react";
import { addTickerScore, getCurrent, getDescription, getKpiBollinger, getKpiMacd, getKpiRsi, getKpiSma, getSector, getTickersScoreWithDay, getTickersScoreWithTickerAndDay, removeTickerScore } from "../utils/requests";
import { getDay, getYesterday } from "../utils/day";
import { computeScore } from "../utils/score";
import { useAuthentification } from "./useAuthentication";

export function useReportData (tickersList, reloadProp, limit = 1) {
    const [reportData, setReportData] = useState([]);
    const [offset, setOffset] = useState(0);
    const { isAuthenticated } = useAuthentification();

    // pour le premier chargement
    useEffect(() => {
        // si tickersList est vide, on ne peut rien faire
        if (tickersList.length === 0) return;

        // on lance le premier chargement
        setOffset(0); // on démarre de zéro
        setReportData([]); // on efface toutes les données actuelles
    }, [tickersList, reloadProp]);

    // pour le second chargement et après (déplacement de l'offset)
    useEffect(() => {
        // si l'utilisateur n'est pas connecté
        if (!isAuthenticated) return;
        // si tickersList est vide, on ne peut rien faire
        if (tickersList.length === 0) return;

        const fetchData = async () => {
            let result = [];                    // données à afficher
            const today = getDay();             // aujourd'hui
            const yesterday = getYesterday();   // hier
            let tickersScoreForTheDay = await getTickersScoreWithDay(today);    // tickersScore de la journée

            // je parcours la liste des tickers dans tickersList
            for (let i = offset; (i < offset + limit) && (i < tickersList.length); i++) {
                const ticker = tickersList[i];
                console.log("Chargement de " + ticker.name + ", i = " + i);

                // 1. S'il y a déjà un enregistrement dans la BDD dans le ticker pour la date en question (journée)
                let tScoreToday = getTickersScoreWithTickerAndDay(ticker.code, today);
                let tScoreYesterday = getTickersScoreWithTickerAndDay(ticker.code, yesterday);

                // TODO
                // 1.1. Stratégie
                // 1.1.1. S'il y a moins d'une heure entre maintenant et le dernier enregistrement
                // Je récupère les données de la BDD et je les affiche directement
                // 1.1.2. S'il y a plus d'une heure entre maintenant et le dernier enregistrement
                // Je recalcule et je remplace les données dans la BDD

                var dataKpiSma = null;
                var dataKpiBollinger = null;
                var dataKpiMacd = null;
                var dataKpiRsi = null;
                var dataCurrent = await getCurrent(ticker.code);
                var dataSector = await getSector(ticker.code);
                var dataDescription = await getDescription(ticker.code);

                // si on a trouvé un enregistrement dans la BDD du jour
                if (tScoreToday !== null) {
                    try {
                        dataKpiSma = tScoreToday.mm;
                        dataKpiBollinger = tScoreToday.bollinger;
                        dataKpiMacd = tScoreToday.macd;
                        dataKpiRsi = parseInt(tScoreToday.rsi);
                    }
                    catch (err) {
                        console.error(`Erreur lors du chargement des informations pour ${ticker.code}`, err);
                    }
                }

                // 2. S'il n'y a aucun enregistrement pour le ticker dans la BDD pour la date en question (journée)
                else {
                    try {
                        // récupération des données via l'API
                        dataKpiSma = await getKpiSma(ticker.code);
                        dataKpiBollinger = await getKpiBollinger(ticker.code);
                        dataKpiMacd = await getKpiMacd(ticker.code);
                        dataKpiRsi = parseInt(await getKpiRsi(ticker.code));
                    } 
                    catch (error) {
                        console.error(`Erreur lors du chargement des KPI pour ${ticker.code}`, error);
                    }
                }

                // calcul du score du ticker
                let scoreComputed = computeScore(dataKpiSma, dataKpiMacd, dataKpiBollinger, dataKpiRsi);

                // A cette etape, on a récupéré toutes les données nécessaires et disponibles à mon tableau pour mon ticker
                // il s'agit alors de mettre le resultat dans la variable "result"
                result.push({
                    code: ticker.code,
                    name: ticker.name,
                    sector: dataSector,
                    description: dataDescription,
                    current: dataCurrent,
                    sma: dataKpiSma,
                    smaYesterday: tScoreYesterday === undefined ? null : tScoreYesterday.mm,
                    bollinger: dataKpiBollinger,
                    bollingerYesterday: tScoreYesterday === undefined ? null : tScoreYesterday.bollinger,
                    rsi: dataKpiRsi,
                    rsiYesterday: tScoreYesterday === undefined ? null : tScoreYesterday.rsi,
                    macd: dataKpiMacd,
                    macdYesterday: tScoreYesterday === undefined ? null : tScoreYesterday.macd,
                    score: scoreComputed,
                    isActive: ticker.isActive
                });
                
                // if (hasTickerScore) {                                       // Si j'ai trouvé mon entreprise 
                //     //await removeTickerScore(ticker.code, today);              // je supprime et remplace
                //     //await addTickerScore(today, ticker.code, dataKpiSma, dataKpiMacd, dataKpiBollinger, dataKpiRsi, scoreComputed);
                // }
                // else {                                                      // Sinon pas mon entreprise pour aujourd'hui, j'écris
                //     //await addTickerScore(today, ticker.code, dataKpiSma, dataKpiMacd, dataKpiBollinger, dataKpiRsi, scoreComputed);
                // }
            }

            /**
             * Partie 3 : Utilisation de la structure remplie précédemment pour affichage et modification du système de pagination
             */
            // merge into local state
            setReportData(prevData => {
                const existingCodes = new Set(prevData.map(item => item.code));
                const newData = result.filter(item => !existingCodes.has(item.code));
                return [...prevData, ...newData];
            });

            // charger la suite uniquement si nécessaire
            if (offset + limit < tickersList.length) {
                setOffset(prev => prev + limit);
            }
        };

        fetchData();
    }, [offset, tickersList, isAuthenticated]);

    return { reportData, setReportData, offset, setOffset };
}