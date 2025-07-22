import React, { useEffect, useState } from "react";
import { useTickersList } from "../hook/useTickerList";
import { getCurrent, getKpiBollinger, getKpiMacd, getKpiSma } from "../utils/requests";
import './ReportPage.css';

function ReportPage() {
    const [reportData, setReportData] = useState([]);
    const { tickersList } = useTickersList();

    useEffect(() => {
        if (tickersList.length === 0) return; // attend que les tickers soient chargés

        const today = new Date().toISOString().split("T")[0]; // ex: "2025-07-09"
        const now = new Date();
        const hours = now.getHours();      // 0 à 23
        const minutes = now.getMinutes();  // 0 à 59
        const seconds = now.getSeconds();  // 0 à 59

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
                    console.log(dataCurrent);

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
                JSON.stringify({ date: today, hours: hours, minutes: minutes, seconds: seconds, data: result })
            );

            setReportData(result);
            
        };

        fetchData();
    }, [tickersList]);

    function clearDataCache () {
        localStorage.removeItem("kpiReportCache"); // pour supprimer le cache
    }

    return <>
        <div id="reportpage">
            <table id="reportpage-table">
                <thead>
                    <tr>
                        <th className="reportpage-th">Action</th>
                        <th className="reportpage-th">Code</th>
                        <th className="reportpage-th">Cours actuel</th>
                        <th className="reportpage-th">MM</th>
                        <th className="reportpage-th">MACD</th>
                        <th className="reportpage-th">Bollinger Band</th>
                        <th className="reportpage-th">Note Globale</th>
                        {/*
                        <th className="reportpage-th">Tendance générale</th>
                        <th className="reportpage-th">Commentaires / alertes</th>
                        */}
                    </tr>
                </thead>
                <tbody>
                    {
                        reportData.map((row, index) => {
                            return (
                                <tr key={row.code}>
                                    <td className="reportpage-td">{row.name}</td>
                                    <td className="reportpage-td">{row.code}</td>
                                    <td className="reportpage-td">{row.current}</td>
                                    <td className="reportpage-td">{row.sma}</td>
                                    <td className="reportpage-td">{row.macd}</td>
                                    <td className="reportpage-td">{row.bollinger}</td>
                                    <td className="reportpage-td">{row.sma * 0.4 + row.macd * 0.2 + row.bollinger * 0.4}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    </>
}

export default ReportPage;