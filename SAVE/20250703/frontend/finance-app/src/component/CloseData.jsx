import { useEffect, useMemo, useRef, useState } from 'react';
import './CloseData.css';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, layouts } from 'chart.js';
import { getCloseData, getMean, getSMA } from '../utils/requests';
import { DateTime } from 'luxon';
import 'chartjs-adapter-date-fns';
import { usePeriod } from '../hook/usePeriod';
import { useTicker } from '../hook/useTicker';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin, zoomPlugin);

function CloseData({ dateData, mouseX, mouseY, setMouseX, setMouseY, min, max, isAnnotationDisplay, setIsAnnotationDisplay }) {
    const [close, setClose] = useState([]);
    const [mean, setMean] = useState(null);
    const [sma20, setSma20] = useState([]);
    const [sma50, setSma50] = useState([]);
    const [sma100, setSma100] = useState([]);
    const [sma200, setSma200] = useState([]);
    const chartRef = useRef(null);
    const { period } = usePeriod();
    const {ticker} = useTicker();

    // Chargement initial
    useEffect(() => {
        const fetchData = async () => {
            setClose(await getCloseData(ticker));
            setMean(await getMean(ticker));
            setSma20(await getSMA(20, ticker));
            setSma50(await getSMA(50, ticker));
            setSma100(await getSMA(100, ticker));
            setSma200(await getSMA(200, ticker));
        };

        fetchData();
    }, [ticker]);

    // Détermination de la date de début à filtrer
    const startDate = useMemo(() => {
        const now = DateTime.now();
        switch (period) {
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
        close: close.slice(minIndex),
        sma20: sma20.slice(minIndex),
        sma50: sma50.slice(minIndex),
        sma100: sma100.slice(minIndex),
        sma200: sma200.slice(minIndex),
        dates: dateData.slice(minIndex)
    }), [close, sma20, sma50, sma100, sma200, dateData, minIndex]);

    // Structure des datasets
    const data = {
        labels: filteredData.dates,
        datasets: [
            {
                label: 'Prix de fermeture',
                data: filteredData.close,
                backgroundColor: 'rgba(0, 0, 0, 1)',
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 2,
                fill: false,
                pointRadius: 2,
            },
            {
                label: 'SMA_20',
                data: filteredData.sma20,
                borderColor: 'rgba(0, 255, 0, 1)',
                backgroundColor: 'rgba(0, 255, 0, 1)',
                borderWidth: 2,
                pointRadius: 0,
            },
            {
                label: 'SMA_50',
                data: filteredData.sma50,
                borderColor: 'rgba(255, 200, 0, 1)',
                backgroundColor: 'rgba(255, 200, 0, 1)',
                borderWidth: 2,
                pointRadius: 0,
            },
            {
                label: 'SMA_100',
                data: filteredData.sma100,
                borderColor: 'rgba(255, 130, 0, 1)',
                backgroundColor: 'rgba(255, 130, 0, 1)',
                borderWidth: 2,
                pointRadius: 0,
            },
            {
                label: 'SMA_200',
                data: filteredData.sma200,
                borderColor: 'rgba(255, 0, 0, 1)',
                backgroundColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 2,
                pointRadius: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        layout: {
            padding: 0,
        },
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
                min: Math.round(min - (max - min) / 5),
                max: Math.round(max + (max - min) / 5),
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Evolution du prix en bourse',
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: min,
                        yMax: min,
                        borderColor: 'rgba(255, 0, 0, 0.3)',
                        borderWidth: 1,
                    },
                    line2: {
                        type: 'line',
                        yMin: max,
                        yMax: max,
                        borderColor: 'rgba(0, 0, 255, 0.3)',
                        borderWidth: 1,
                    },
                    line3: {
                        type: 'line',
                        xMin: mouseX,
                        xMax: mouseX,
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 2,
                        display: isAnnotationDisplay,
                    },
                    meanLine: {
                        type: 'line',
                        borderColor: 'rgba(0, 255, 0, 0.3)',
                        borderWidth: 1,
                        yMin: mean,
                        yMax: mean,
                    }
                }
            }
        },
    };

    if (dateData.length === 0 || close.length === 0) {
        return <div>Chargement des données...</div>;
    }

    return (
        <div id="closedata">
            <div className="closedata-charts">
                <Line data={data} options={options} ref={chartRef} />
            </div>
            <div>
                Les choses à vérifier sur ce graphique :
                <ul>
                    <li>
                        les tendances du marché : baissier / haussier ? <br/> 
                        {"=>"} Une tendance haussière se définira par la méthode suivante : <br/> SMA_20 {">"} SMA_50 {">"} SMA_200 (le feu rouge à l'envers). <br/>
                        C'est bien entendu l'inverse pour la tendance baissière.
                    </li>
                    <li>
                        En tandance haussière, éviter les achats loins des moyennes mobiles. <br/>
                        Effectivement, les moyennes mobiles sont des aimants et "attirent" les cours vers leurs valeurs.
                    </li>
                    <li>
                        Graphique à ne pas utiliser lorsque les moyennes mobiles restent proches les unes des autres et se croisent souvent
                    </li>
                    <li>
                        https://www.youtube.com/watch?v=ZCUkY0dHfGM
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default CloseData;
