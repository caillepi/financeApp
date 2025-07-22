import React, { useEffect, useMemo, useState } from "react";
import './Macd.css';
import { getMACD } from "../utils/requests";
import { Line } from "react-chartjs-2";
import { usePeriod } from "../hook/usePeriod";
import { DateTime } from "luxon";
import { useTicker } from '../hook/useTicker';

function Macd({ dateData, mouseX, mouseY, setMouseX, setMouseY, min, max, isAnnotationDisplay, setIsAnnotationDisplay }) {
    const [macd, setMacd] = useState([]);
    const [signal, setSignal] = useState([]);
    const { period } = usePeriod();
    let {ticker} = useTicker();

    // Chargement initial des données MACD + Signal
    useEffect(() => {
        const fetchData = async () => {
            const [macdData, signalData] = await getMACD(ticker);
            setMacd(macdData);
            setSignal(signalData);
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
        macd: macd.slice(minIndex),
        signal: signal.slice(minIndex),
        dates: dateData.slice(minIndex)
    }), [macd, signal, dateData, minIndex]);

    // Données pour le graphique
    const dataMacd = {
        labels: filteredData.dates,
        datasets: [
            {
                label: 'MACD',
                data: filteredData.macd,
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointRadius: 0,
            },
            {
                label: 'SIGNAL',
                data: filteredData.signal,
                backgroundColor: 'rgba(255, 0, 0, 1)',
                borderColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 2,
                pointRadius: 0,
            },
            {
                type: 'bar',
                label: 'MACDH',
                data: filteredData.macd.map((elt, idx) => elt - filteredData.signal[idx]),
                backgroundColor: filteredData.macd.map((elt, idx) => elt - filteredData.signal[idx]).map(value =>
                    value > 0 ? 'rgba(0, 255, 0, 0.4)' : 'rgba(255, 0, 0, 0.4)'
                ),
                borderColor: filteredData.macd.map((elt, idx) => elt - filteredData.signal[idx]).map(value =>
                    value > 0 ? 'rgba(0, 255, 0, 0.4)' : 'rgba(255, 0, 0, 0.4)'
                ),
                borderWidth: 2
            }
        ],
    };

    // Options pour le graphique
    const optionsMacd = {
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
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'MACD',
            },
        },
    };

    return (
        <div id="macd">
            <div className="macd-macd">
                <Line data={dataMacd} options={optionsMacd} />
            </div>
            <div>
                Les choses à vérifier sur ce graphique
                <ul>
                    <li>
                        Petit rappel sur la méthode de calcul : <br/>
                        La ligne de MACD : différence entre la MME_12 et la MME_26. <br/>
                        La ligne de signal : MME_9 du MACD
                    </li>
                    <li>
                        Attention : il a tendance à signaler avant le croisement des SMA 20 et 50. Il a donc tendance à se tromper et doit être confirmer avec d'autres indicateurs.
                    </li>
                    <li>
                        Pour vouloir acheter, il faut que la ligne du MACD soit supérieur à la ligne de signal.
                        Si c'est le cas, l'histogramme est vert, sinon il est rouge.
                    </li>
                    <li>
                        Lorsque l'histogramme est vert : C'est un <b>signal d'achat</b>, <br/>
                        Lorsque l'histogramme est rouge : C'est un <b>signal de vente</b>
                    </li>
                    <li>
                        Si MACD {">"} 0 : la SMA_12 (court terme) {">"} SMA_26 (moyen terme). <b>Suggère une tendance haussière.</b> <br/>
                        Si MACD {"<"} 0  : c'est l'inverse. <b>Suggère plutôt une tendance baissière.</b>
                    </li>
                    <li>
                        Il est également intéressant de regarder le pente avec laquelle le MACD et la ligne de signal se croisent. C'est c'est pentu, plus le signal est clair.
                    </li>
                    <li>
                        Avant toute entrée sur le marché, s'assurer qu'il y ait un minimum de (14 ?) séances avant le croisement ce qui assure que la situtation était suffisamment stable.
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Macd;