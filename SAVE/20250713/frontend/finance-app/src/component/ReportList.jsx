import React, { useEffect, useState } from "react";
import { useTickersList } from "../hook/useTickerList";
import { getCurrent, getKpiBollinger, getKpiMacd, getKpiSma } from "../utils/requests";
import './ReportList.css';
import { useNavigate } from "react-router-dom";
import { useTicker } from "../hook/useTicker";
import ReportListFilter from "./ReportListFilter";

function ReportList() {
    const [reportData, setReportData] = useState([]);
    const [reloadProp, setReloadProp] = useState(0);
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'asc'});
    const [filters, setFilters] = useState({name: '', code: '', coursMin: '', coursMax: '', noteMin: '', noteMax: ''});
    const [lastReload, setLastReload] = useState(null);
    const { tickersList } = useTickersList();
    const navigate = useNavigate();
    const { changeTicker } = useTicker();

    // A continuer (pas fini car pas réussi à l'afficher)

    useEffect(() => {
        if (tickersList.length === 0) return; // attend que les tickers soient chargés

        const today = new Date().toISOString().split("T")[0]; // ex: "2025-07-09"
        const now = new Date();

        // on utilise le cache de l'application
        const cachedData = localStorage.getItem("kpiReportCache");

        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            if (parsed.date === today) {
                setReportData(parsed.data); // réutilise les données mises en cache
                return;
            }
        }

        const fetchData = async () => {
            let result = [];

            for (const ticker of tickersList) {
                
                try {
                    const dataKpiSma = await getKpiSma(ticker.code);
                    const dataKpiBollinger = await getKpiBollinger(ticker.code);
                    const dataKpiMacd = await getKpiMacd(ticker.code);
                    const dataCurrent = await getCurrent(ticker.code);

                    result.push({
                        code: ticker.code,
                        name: ticker.name,
                        current: dataCurrent,
                        sma: dataKpiSma,
                        bollinger: dataKpiBollinger,
                        macd: dataKpiMacd
                    })
                } catch (error) {
                    console.error(`Erreur lors du chargement des KPI pour ${ticker.code}`, error);
                }
            }

            // Mise en cache
            localStorage.setItem(
                "kpiReportCache",
                JSON.stringify({ date: today, data: result })
            );

            setReportData(result);
            
        };

        fetchData();
        setLastReload(now.toLocaleString());
    }, [tickersList, reloadProp]);

    function clearDataCache () {
        localStorage.removeItem("kpiReportCache"); // pour supprimer le cache
    }

    function handleReloadData () {
        clearDataCache();
        // effacer les valeurs du tableau
        setReportData([]);
        // changement de valeur pour exécuter le useEffect et recharger les données
        setReloadProp(prev => prev === 0 ? 1 : 0);
    }

    function computeScore(sma, macd, bollinger) {
        let ponderationSMA = 0.4;
        let ponderationMACD = 0.2;
        let ponderationBollinger = 0.4;

        return ponderationSMA * sma + ponderationMACD * macd + ponderationBollinger * bollinger;
    }

    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const handleNameClick = (code) => {
        changeTicker(code);
        navigate('/');
    }

    const sortedData = React.useMemo(() => {
        let sortable = [...reportData];
        if (sortConfig.key) {
            sortable.sort((a, b) => {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];

                // Gestion des "Note Globale" calculée
                if (sortConfig.key === 'score') {
                    valA = computeScore(a.sma, a.macd, a.bollinger);
                    valB = computeScore(b.sma, b.macd, b.bollinger);
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
            let score = computeScore(item.sma, item.macd, item.bollinger);
            const matchesNoteMin = filters.noteMin ? score >= parseFloat(filters.noteMin) : true;
            const matchesNoteMax = filters.noteMax ? score <= parseFloat(filters.noteMax) : true;
            return matchesName && matchesCode && matchesCoursMin && matchesCoursMax && matchesNoteMin && matchesNoteMax;
        });
    }, [sortedData, filters]);


    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return <>
        <div id="reportlist">
            <div id="reportlist-reload">
                <button 
                    onClick = { handleReloadData }
                    id="reportlist-reload-button"
                    >
                    Reload data
                </button>
            </div>

            {/* Afficher la date du dernier reload */}
            {lastReload && (
                <div id="last-reload">
                    Dernier reload : {lastReload}
                </div>
            )}


            <ReportListFilter onFilterChange = {handleFilterChange}/>
            <table id="reportlist-table">
                <thead>
                    <tr>
                        <th className="reportlist-th" onClick={() => handleSort('name')}>Action</th>
                        <th className="reportlist-th" onClick={() => handleSort('code')}>Code</th>
                        <th className="reportlist-th" onClick={() => handleSort('current')}>Cours actuel</th>
                        <th className="reportlist-th" onClick={() => handleSort('sma')}>MM</th>
                        <th className="reportlist-th" onClick={() => handleSort('macd')}>MACD</th>
                        <th className="reportlist-th" onClick={() => handleSort('bollinger')}>Bollinger Band</th>
                        <th className="reportlist-th" onClick={() => handleSort('score')}>Note Globale</th>
                        {/*
                        <th className="reportlist-th">Tendance générale</th>
                        <th className="reportlist-th">Commentaires / alertes</th>
                        */}
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredData.map((row, index) => {
                            return (
                                <tr key={row.code}>
                                    <td className="reportlist-td" onClick={() => handleNameClick(row.code)}>{row.name}</td>
                                    <td className="reportlist-td">{row.code}</td>
                                    <td className="reportlist-td">{row.current}</td>
                                    <td className="reportlist-td">{row.sma}</td>
                                    <td className="reportlist-td">{row.macd}</td>
                                    <td className="reportlist-td">{row.bollinger}</td>
                                    <td className="reportlist-td">{computeScore(row.sma, row.macd, row.bollinger)}</td>
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