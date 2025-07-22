import React, { useEffect, useMemo, useState } from "react";
import './RsiChart.css';
import { useTicker } from "../hook/useTicker";
import { getRsi } from "../utils/requests";
import { Line } from "react-chartjs-2";
import { usePeriod } from "../hook/usePeriod";
import { DateTime } from "luxon";

function RsiChart({dateData}) {
    const [rsi, setRsi] = useState([]);
    const { ticker } = useTicker();
    const { period } = usePeriod();

    useEffect(() => {
        let fetchData = async () => {
            setRsi(await getRsi(ticker));
        };

        fetchData();
    }, [ticker]);

    // Détermination de la date de début à filtrer
    const startDate = useMemo(() => {
            const now = DateTime.now();
            switch (period) {
                case 'FIVE_YEARS':
                    return now.minus({ years: 5 });
                case 'TWO_YEARS':
                    return now.minus({ years: 2 });
                case 'ONE_YEAR':
                    return now.minus({ years: 1 });
                case 'SIX_MONTHS':
                    return now.minus({ months: 6 });
                case 'ONE_MONTH':
                    return now.minus({ months: 1 });
                case 'ONE_WEEK':
                    return now.minus({ weeks: 1 });
                default:
                    return null;
            }
        }, [period]);

    // Indices filtrés
    const filteredIndices = useMemo(() => {
        if (!startDate || !dateData.length) return [];

        return dateData
            .map((dateStr, i) => DateTime.fromISO(dateStr) >= startDate ? i : -1)
            .filter(i => i !== -1);
    }, [startDate, dateData]);

    const minIndex = useMemo(() => {
        return filteredIndices.length ? Math.min(...filteredIndices) : 0;
    }, [filteredIndices]);

    // Données filtrées à afficher
    const filteredData = useMemo(() => ({
        rsi: rsi.slice(minIndex),
        dates: dateData.slice(minIndex)
    }), [rsi, dateData, minIndex]);

    // Données pour le graphique
    const data = {
        labels: filteredData.dates,
        datasets: [
            {
                label: 'RSI',
                data: rsi,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 0,
            },
        ],
    };

    // Options pour le graphique
    const options = {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {unit: 'week'},
                ticks: {display: true},
                grid: {
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: true,
                }
            },
            y: {
                min: 0,
                max: 100,
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'RSI',
            },
            annotation: {
                annotations: {
                    surachat: {
                        type: 'line',
                        yMin: 30,
                        yMax: 30,
                        borderColor: 'rgba(255, 0, 0, 0.8)',
                        borderWidth: 1,
                    },
                    survente: {
                        type: 'line',
                        yMin: 70,
                        yMax: 70,
                        borderColor: 'rgba(0, 0, 255, 0.8)',
                        borderWidth: 1,
                    }
                }
            }
        },
    };

    if (dateData.length === 0 || rsi.length === 0) {
            return <div>Chargement des données...</div>;
        }

    return <>
        <div id="rsichart">
            <Line data={data} options={options}/>
            <div>
                <br/>
                Les choses à vérifier sur ce graphique :                <br/>
                100 ───────────────────────────── Surachat ({">"}70)    <br/>
                90 ─                                                    <br/>
                80 ─                                                    <br/>
                70 ────── ← Souvent un signal de baisse à venir         <br/>
                60 ─                                                    <br/>
                50 ────── ← Zone d'équilibre (tendance neutre)          <br/>
                40 ─                                                    <br/>
                30 ────── ← Souvent un signal d'achat potentiel         <br/>
                20 ─                                                    <br/>
                10 ─                                                    <br/>
                0 ───────────────────────────── Survente ({"<"}30)
            </div>
        </div>
    </>
}

export default RsiChart;