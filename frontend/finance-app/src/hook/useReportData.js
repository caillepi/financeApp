import { useEffect, useRef, useState } from "react";
import { addTicker, addTickerScore, getCurrent, getDescription, getKpiBollinger, getKpiMacd, getKpiRsi, getKpiSma, getSector, getTickersScoreWithDay, getTickersScoreWithTickerAndDay, removeTickerScore } from "../utils/requests";
import { getDay, getYesterday } from "../utils/day";
import { computeScore } from "../utils/score";
import { useAuthentification } from "./useAuthentication";

export function useReportData (tickersList, reloadProp, limit = 1) {
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const { isAuthenticated } = useAuthentification();
    const isFetchingRef = useRef(false);

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
        // si toujours en train de charger le ticker précédent pour éviter de faire plusieurs fois le même
        if (isFetchingRef.current) return;

        isFetchingRef.current = true;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                let result = [];                    // données à afficher
                let dataToStore = [];               // données à enregistrer en base
                const today = getDay();             // aujourd'hui
                const yesterday = getYesterday();   // hier

                // je recupere les tickers de la BDD pour aujourd'hui et hier
                let tickersScoreForTheDay = await getTickersScoreWithDay(today);            // aujourd'hui
                let tickersScoreForYesterday = await getTickersScoreWithDay(yesterday);     // hier
                
                // je parcours la liste des tickers dans tickersList
                for (let i = offset; (i < offset + limit) && (i < tickersList.length); i++) {
                    const ticker = tickersList[i];
                    console.log("Chargement de " + ticker.name + ", i = " + i);

                    // 1. Je regarde dans la BDD s'il y a des données pour le ticker en question (aujourd'hui et hier)
                    let tScoreToday = tickersScoreForTheDay.filter((elt) => elt.code == ticker.code)[0]
                    let tScoreYesterday = tickersScoreForYesterday.filter((elt) => elt.code == ticker.code)[0]

                    // Pour le moment, s'il y a des données pour aujourd'hui, je les prends en compte
                    // Pour plus tard // TODO
                    // 1.1. Stratégie
                    // 1.1.1. S'il y a moins d'une heure entre maintenant et le dernier enregistrement
                    // Je récupère les données de la BDD et je les affiche directement
                    // 1.1.2. S'il y a plus d'une heure entre maintenant et le dernier enregistrement
                    // Je recalcule et je remplace les données dans la BDD

                    // variables pour mes données
                    var dataKpiSma = null;
                    var dataKpiBollinger = null;
                    var dataKpiMacd = null;
                    var dataKpiRsi = null;
                    var dataCurrent = await getCurrent(ticker.code);
                    var dataSector = await getSector(ticker.code);
                    var dataDescription = await getDescription(ticker.code);

                    // booleen pour savoir si j'ai un enregistrement pour aujourd'hui
                    let hasTickerScore = false;

                    // si on a trouvé un enregistrement dans la BDD du jour
                    if (tScoreToday !== undefined) {
                        hasTickerScore = true;
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

                    // 2. S'il n'y a aucun enregistrement pour le ticker dans la BDD pour la date en question (journée)
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
                    // J'enregistre les données dans 'result' pour les afficger par la suite

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
                        scoreYesterday: tScoreYesterday === undefined ? null : tScoreYesterday.score,
                        isActive: ticker.isActive
                    });

                    // J'enregistre les donnees à enregistrer en BDD
                    dataToStore.push({
                        code: ticker.code,
                        sma: dataKpiSma,
                        bollinger: dataKpiBollinger,
                        rsi: dataKpiRsi,
                        macd: dataKpiMacd,
                        score: scoreComputed,
                        hasTickerScore: hasTickerScore
                    })
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

                // Je parcours mes données à enregistrer
                // Si déjà présent, je ne fais rien
                // Si pas présent, alors j'enregistre
                dataToStore.forEach((elt) => {
                    if (elt.hasTickerScore) {                                   // Si j'ai trouvé mon entreprise
                        // je ne fais rien pour le moment // TODO 
                        // removeTickerScore(ticker.code, today);              // je supprime et remplace
                        // addTickerScore(today, elt.code, elt.sma, elt.mm, elt.macd, elt.rsi, elt.score);
                    }
                    else {                                                  // Sinon pas mon entreprise pour aujourd'hui, j'écris
                        addTickerScore(today, elt.code, elt.sma, elt.macd, elt.bollinger, elt.rsi, elt.score);
                    }
                })

                // charger la suite uniquement si nécessaire
                if (offset + limit < tickersList.length) {
                    setOffset(prev => prev + limit);
                }

            }
            catch (err) {
                console.error("Error while executing fetchData function in useReportData : ", err);
            }
            finally {
                isFetchingRef.current = false;
            }
        };

        fetchData();
    }, [offset, tickersList, isAuthenticated]);

    return { reportData, setReportData, offset, setOffset };
}