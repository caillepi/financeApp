import { useEffect, useState } from "react";
import { addTickerScore, getCurrent, getDescription, getKpiBollinger, getKpiMacd, getKpiRsi, getKpiSma, getSector, getTickersScoreWithDay, getTickersScoreWithTickerAndDay, removeTickerScore } from "../utils/requests";
import { getDay, getYesterday } from "../utils/day";
import { computeScore } from "../utils/score";



export function useReportData (tickersList, reloadProp, limit = 1) {
    const [reportData, setReportData] = useState([]);
    const [offset, setOffset] = useState(0);

    // pour le premier chargement
    useEffect(() => {
        if (tickersList.length === 0) return;

        // on lance le premier chargement
        setOffset(0); // start from 0
        setReportData([]); // clear existing data
    }, [tickersList, reloadProp]);

    // pour le second chargement et après (déplacement de l'offset)
    useEffect(() => {
        if (tickersList.length === 0) return;

        const now = getDay();

        const fetchData = async () => {
            let result = [];
            let tickersScoreForTheDay = await getTickersScoreWithDay(now);    // tickersScore de la journée

            for (let i = offset; (i < offset + limit) && (i < tickersList.length); i++) {
                const ticker = tickersList[i];
                try {
                    const dataKpiSma = await getKpiSma(ticker.code);
                    const dataKpiBollinger = await getKpiBollinger(ticker.code);
                    const dataKpiMacd = await getKpiMacd(ticker.code);
                    const dataKpiRsi = parseInt(await getKpiRsi(ticker.code));
                    const dataCurrent = await getCurrent(ticker.code);
                    const dataSector = await getSector(ticker.code);
                    const dataDescription = await getDescription(ticker.code);
                    let yesterday = getYesterday();
                    let dataTickersScore = await getTickersScoreWithTickerAndDay(ticker.code, yesterday);

                    if (dataTickersScore != null) {
                        result.push({
                            code: ticker.code,
                            name: ticker.name,
                            sector: dataSector,
                            description: dataDescription,
                            current: dataCurrent,
                            sma: dataKpiSma,
                            smaYesterday: dataTickersScore.mm,
                            bollinger: dataKpiBollinger,
                            bollingerYesterday: dataTickersScore.bollinger,
                            rsi: dataKpiRsi,
                            rsiYesterday: dataTickersScore.rsi,
                            macd: dataKpiMacd,
                            macdYesterday: dataTickersScore.macd,
                            isActive: ticker.isActive
                        });
    
                        // logique :
                        // S'il y a déjà quelque chose d'écrit dans le CSV pour la date du tour, alors je le supprime et le remplace
                        let hasTickerScore = false;                                 // booleen -> FALSE                             
                        tickersScoreForTheDay.forEach((tickerScore) => {            // parcourir tous les tickersScore
                            if (tickerScore.code === ticker.code) {                 // Si je toruve mon entreprise
                                hasTickerScore = true;                              // boolean -> TRUE
                            }
                        });
    
                        let scoreComputed = computeScore(dataKpiSma, dataKpiMacd, dataKpiBollinger, dataKpiRsi);
                        
                        if (hasTickerScore) {                                       // Si j'ai trouvé mon entreprise 
                            await removeTickerScore(ticker.code, now);              // je supprime et remplace
                            await addTickerScore(now, ticker.code, dataKpiSma, dataKpiMacd, dataKpiBollinger, dataKpiRsi, scoreComputed);
                        }
                        else {                                                      // Sinon pas mon entreprise pour aujourd'hui, j'écris
                            await addTickerScore(now, ticker.code, dataKpiSma, dataKpiMacd, dataKpiBollinger, dataKpiRsi, scoreComputed);
                        }
                    }
                } catch (error) {
                    console.error(`Erreur lors du chargement des KPI pour ${ticker.code}`, error);
                }
            }

            // merge into local state
            setReportData(prevData => {
                const existingCodes = new Set(prevData.map(item => item.code));
                const newData = result.filter(item => !existingCodes.has(item.code));
                return [...prevData, ...newData];
            });

            // 🔁 charger la suite uniquement si nécessaire
            if (offset + limit < tickersList.length) {
                setOffset(prev => prev + limit);
            }
        };

        fetchData();
    }, [offset, tickersList]);

    return { reportData, setReportData, offset, setOffset };
}