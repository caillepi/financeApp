import React, { useEffect, useRef, useState } from "react";
import { useTickersList } from "../hook/useTickerList";
import { addTickerScore, getCurrent, getDescription, getKpiBollinger, getKpiMacd, getKpiRsi, getKpiSma, getSector, getTickersScoreWithDay, getTickersScoreWithTicker, getTickersScoreWithTickerAndDay, removeTickerScore } from "../utils/requests";
import './ReportList.css';
import { useNavigate } from "react-router-dom";
import { useTicker } from "../hook/useTicker";
import ReportListFilter from "./ReportListFilter";
import { handleExportPDF } from "../utils/pdfExport";
import { handleSendEmail } from "../utils/sendEmail";
import { getDay, getYesterday } from "../utils/day";
import { computeScore } from "../utils/score";

function ReportList() {
    const [reportData, setReportData] = useState([]);
    const [reloadProp, setReloadProp] = useState(0);
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'asc'});
    const [filters, setFilters] = useState({name: '', code: '', coursMin: '', coursMax: '', noteMin: '', noteMax: ''});
    const [lastReload, setLastReload] = useState(null);
    const [offset, setOffset] = useState(0);        // lazy loading pour le tableau
    const [limit, setLimit] = useState(1);          // nombre d'éléments à charger par batch de chargement
    const { tickersList } = useTickersList();
    const navigate = useNavigate();
    const { changeTicker } = useTicker();
    const emailContent = useRef();

    // pour le premier chargement
    useEffect(() => {
        if (tickersList.length === 0) return;

        const now = getDay();

        const cachedData = localStorage.getItem("kpiReportCache");

        try {
            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                if (parsed.data.length === tickersList.length) {
                    if (parsed.date === now) {
                        setReportData(parsed.data);
                        setLastReload(now.toLocaleString());
                        return;
                    }
                }
            }
        } catch (err) {
            console.error("Erreur lors du chargement du cache", err);
        }

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
                        macdYesterday: dataTickersScore.macd
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

            // save in cache
            localStorage.setItem("kpiReportCache", JSON.stringify({
                date: now,
                data: [...reportData, ...result]
            }));

            // 🔁 charger la suite uniquement si nécessaire
            if (offset + limit < tickersList.length) {
                setOffset(prev => prev + limit);
            }
        };

        fetchData();
    }, [offset, tickersList]);

    function logCache() {
        const cachedData = localStorage.getItem("kpiReportCache");
        console.log(JSON.parse(cachedData));
    }

    /**
     * Fonction qui permet d'effacer la valeur "kpiReportCache" du cache
     */
    function clearDataCache () {
        localStorage.removeItem("kpiReportCache"); // pour supprimer le cache
    }

    /**
     * Fonction qui permet de relancer le chargement des données du tableau
     */
    function handleReloadData () {
        // effacer le cache des valeurs
        clearDataCache();
        // effacer les valeurs du tableau
        setReportData([]);
        // remettre l'offset à 0
        setOffset(0);
        // changement de valeur pour exécuter le useEffect et recharger les données
        setReloadProp(prev => prev === 0 ? 1 : 0);
    }

    /**
     * Fonction qui permet de ne recharger qu'un seul élément sur demande de l'utilisateur
     * @param {String} name - nom de l'entreprise
     * @param {String} code - code de l'entreprise
     */
    async function handleReloadOneElement (name, code) {
        const dataKpiSma = await getKpiSma(code);
        const dataKpiBollinger = await getKpiBollinger(code);
        const dataKpiMacd = await getKpiMacd(code);
        const dataKpiRsi = parseInt(await getKpiRsi(ticker.code));
        const dataCurrent = await getCurrent(code);
        const dataSector = await getSector(code);

        let newData = {
            code: code,
            name: name,
            sector: dataSector,
            current: dataCurrent,
            sma: dataKpiSma,
            bollinger: dataKpiBollinger,
            rsi: dataKpiRsi,
            macd: dataKpiMacd
        }

        setReportData(prevData => {
            let result = [];
            prevData.forEach((item) => {
                if (item.code === code) {
                    result.push(newData);
                }
                else {
                    result.push(item);
                }
            })
            return result;
        })
        
    }

    /**
     * Fonction qui permet d'être redirigé vers la page du ticker cliqué
     * @param {String} code 
     */
    const handleNameClick = (code) => {
        changeTicker(code);
        navigate('/');
    }

    /**
     * Retourne un objet qui va permettre de savoir sur quelle colonne filtrer et dans quelle direction
     * @param {String} key Retourne la clé surlaquelle il va falloir filtrer
     * @returns {Object {String, String}} Retourne la clé et la direction du tri à effectuer
     */
    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const sortedData = React.useMemo(() => {
        let sortable = [...reportData];
        if (sortConfig.key) {
            sortable.sort((a, b) => {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];

                // Gestion des "Note Globale" calculée
                if (sortConfig.key === 'score') {
                    valA = computeScore(a.sma, a.macd, a.bollinger, a.rsi);
                    valB = computeScore(b.sma, b.macd, b.bollinger, b.rsi);
                }

                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();

                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortable;
    }, [reportData, sortConfig]);

    const filteredData = React.useMemo(() => {
        return sortedData.filter((item) => {
            // nom de l'entreprise
            const matchesName = item.name.toLowerCase().includes(filters.name.toLowerCase());
            // code de l'entreprise
            const matchesCode = item.code.toLowerCase().includes(filters.code.toLowerCase());
            // cours de la bourse
            const matchesCoursMin = filters.coursMin ? item.current >= parseFloat(filters.coursMin) : true;
            const matchesCoursMax = filters.coursMax ? item.current <= parseFloat(filters.coursMax) : true;
            // score
            let score = computeScore(item.sma, item.macd, item.bollinger, item.rsi);
            const matchesNoteMin = filters.noteMin ? score >= parseFloat(filters.noteMin) : true;
            const matchesNoteMax = filters.noteMax ? score <= parseFloat(filters.noteMax) : true;
            return matchesName && matchesCode && matchesCoursMin && matchesCoursMax && matchesNoteMin && matchesNoteMax;
        });
    }, [sortedData, filters]);

    /**
     * Fonction qui permet d'appliquer les nouveaux filtres
     * @param {Object} newFilters 
     */
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return <>
        <div id="reportlist" ref={emailContent}>
            <div id="reportlist-actions">
                <button 
                    onClick = {handleReloadData}
                    className="reportlist-actions-reload"
                    >
                    Recharger les données
                </button>
                <button 
                    onClick={handleExportPDF}
                    className="reportlist-actions-export"
                    >
                    Exporter en PDF
                </button>
                <button 
                    onClick={() => handleSendEmail(emailContent.current.innerHTML)}
                    className="reportlist-actions-email"
                    >
                    Envoyer un email
                </button>
                <button 
                    onClick={() => logCache()}
                    className="reportlist-actions-email"
                    >
                    Afficher cache
                </button>
            </div>

            {/* Afficher la date du dernier reload */}
            {lastReload && (
                <div id="last-reload">
                    Dernier reload : {lastReload}
                </div>
            )}

            {/* Mise en place des filtres */}
            <ReportListFilter onFilterChange = {handleFilterChange}/>

            {/* Mise en place des tableaux */}
            <table id="reportlist-table" style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th className="reportlist-th" style={{ width: "1%" }}></th>
                        <th className="reportlist-th" style={{ width: "9%" }} onClick={() => handleSort('name')}>Action</th>
                        <th className="reportlist-th" style={{ width: "5%" }} onClick={() => handleSort('code')}>Code</th>
                        <th className="reportlist-th" style={{ width: "7%" }} onClick={() => handleSort('sector')}>Secteur</th>
                        <th className="reportlist-th" style={{ width: "7%" }} onClick={() => handleSort('current')}>Cours actuel</th>
                        <th className="reportlist-th" style={{ width: "5%" }} onClick={() => handleSort('sma')}>MM</th>
                        <th className="reportlist-th" style={{ width: "6%" }} onClick={() => handleSort('macd')}>MACD</th>
                        <th className="reportlist-th" style={{ width: "6%" }} onClick={() => handleSort('bollinger')}>Bollinger Band</th>
                        <th className="reportlist-th" style={{ width: "6%" }} onClick={() => handleSort('rsi')}>RSI</th>
                        <th className="reportlist-th" style={{ width: "3%" }} onClick={() => handleSort('score')}>Note Globale</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredData.map((row, index) => {
                            return (
                                <tr key={row.code}>
                                    <td className="reportlist-td centered">
                                        <button onClick={() => handleReloadOneElement(row.name, row.code)}
                                                title="Recharger l'élément"
                                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                            ⟳
                                        </button>
                                    </td>
                                    <td className="reportlist-td" onClick={() => handleNameClick(row.code)}>
                                        <div className="reportlist-td-name">
                                            <div className="reportlist-td-name-entreprise">
                                                {row.name}                              
                                            </div>
                                            <div className="reportlist-td-name-tooltip-container">
                                                ⓘ
                                                <div className="reportlist-td-name-tooltip">
                                                    {row.description}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="reportlist-td">{row.code}</td>
                                    <td className="reportlist-td">{row.sector}</td>
                                    <td className="reportlist-td">{row.current}</td>
                                    <td className="reportlist-td">{row.sma} ({row.smaYesterday})</td>
                                    <td className="reportlist-td">{row.macd} ({row.macdYesterday})</td>
                                    <td className="reportlist-td">{row.bollinger} ({row.bollingerYesterday})</td>
                                    <td className="reportlist-td">{row.rsi} ({row.rsiYesterday})</td>
                                    <td className="reportlist-td">{computeScore(row.sma, row.macd, row.bollinger, row.rsi)}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

        </div>
    </>
}

export default ReportList;