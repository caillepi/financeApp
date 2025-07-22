import React, { useEffect, useMemo, useRef, useState } from "react";
import { Chart, Legend, registerables } from 'chart.js';
import 'chartjs-plugin-annotation';import { getCloseData, getMaxData, getMinData, getOpenData } from "../utils/requests";
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import { usePeriod } from "../hook/usePeriod";
import { DateTime } from "luxon";
import { useTicker } from '../hook/useTicker';

Chart.register(...registerables, CandlestickController, CandlestickElement);

function Candlestick ({ dateData }) {
    const [close, setClose] = useState([]);
    const [open, setOpen] = useState([]);
    const [maxList, setMaxList] = useState([]);
    const [minList, setMinList] = useState([]);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    let chartType = 'candlestick';

    const { period } = usePeriod();
    const { ticker } = useTicker();
    
    useEffect(() => {
        const fetchData = async () => {
            setClose(await getCloseData(ticker));
            setOpen(await getOpenData(ticker));
            setMinList(await getMinData(ticker, period));
            setMaxList(await getMaxData(ticker, period));
        };

        fetchData();
    }, [ticker]);

    // Date de début de filtrage en fonction de la période
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

    // Indices filtrés à partir de la date
    const filteredIndices = useMemo(() => {
        if (!startDate || !dateData.length) return [];
        return dateData
            .map((dateStr, i) => DateTime.fromISO(dateStr) >= startDate ? i : -1)
            .filter(i => i !== -1);
    }, [startDate, dateData]);

    const minIndex = useMemo(() => {
        return filteredIndices.length ? Math.min(...filteredIndices) : 0;
    }, [filteredIndices]);

    // Données filtrées
    const filteredData = useMemo(() => ({
        close: close.slice(minIndex),
        open: open.slice(minIndex),
        maxList: maxList.slice(minIndex),
        minList: minList.slice(minIndex),
        dates: dateData.slice(minIndex)
    }), [close, open, maxList, minList, dateData, minIndex]);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        if (chartInstance.current) {
            chartInstance.current.destroy();
        };

        const candleData = filteredData.dates.map((elt, i) => ({
            x: new Date(elt),
            o: parseFloat(filteredData.open[i]).toFixed(2),
            h: parseFloat(filteredData.maxList[i]).toFixed(2),
            l: parseFloat(filteredData.minList[i]).toFixed(2),
            c: parseFloat(filteredData.close[i]).toFixed(2),
        }));

        const lineData = filteredData.close.map((elt, i) => {
            return {x: new Date(filteredData.dates[i]), y: elt};
        });

        const datasets = [];

        if (chartType == "candlestick") {
            datasets.push({
                label: 'Candlestick',
                type: 'candlestick',
                data: candleData,
                borderColor: 'rgba(0, 0, 0, 1)',
                barThickness: 3
            });
        }
        else if (chartType == "line") {
            datasets.push({
                label: 'Close',
                type: 'line',
                data: lineData,
                borderColor: 'rgba(0, 0, 255, 0.3)',
                backgroundColor: 'rgba(0, 0, 255, 0.3)',
                pointRadius: 0,
                tension: 0.1,
                borderWidth: 0.8,
            });
        };

        chartInstance.current = new Chart(ctx, {
            type: chartType,
            data: {
                datasets: datasets,
            },
            options: {
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
                    }
                }
            }
        }, []);

        return () => {
            chartInstance.current.destroy();
        };
    }, [filteredData, chartType]);

    return <>
        <div id="candlestick">
            <canvas ref={chartRef}></canvas>
        </div>
    </>
}

export default Candlestick;