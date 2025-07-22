import React, { useEffect, useMemo, useRef, useState } from "react";
import './BollingerBand.css';
import { getBollingerBand, getCloseData } from "../utils/requests";
import { usePeriod } from "../hook/usePeriod";
import { DateTime } from "luxon";
import { Line } from "react-chartjs-2";
import { useTicker } from '../hook/useTicker';

function BollingerBand({ dateData, mouseX, mouseY, setMouseX, setMouseY, min, max, isAnnotationDisplay, setIsAnnotationDisplay }) {
    const [close, setClose] = useState([]);
    const [mean, setMean] = useState([]);
    const [stddev, setStddev] = useState([]);
    const [facteur, setfacteur] = useState(2);

    const chartRef = useRef(null);
    const { period } = usePeriod();
    let {ticker} = useTicker();

    useEffect(() => {
        const fetchData = async () => {
            setClose(await getCloseData(ticker));
            let result = await getBollingerBand(ticker);
            setMean(result[0]);
            setStddev(result[1]);
            setfacteur(2);
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
        close: close.slice(minIndex),
        mean: mean.slice(minIndex),
        stddev: stddev.slice(minIndex),
        dates: dateData.slice(minIndex)
    }), [close, mean, stddev, minIndex]);

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
                id: 'datasetclose'
            },
            {
                label: 'SMA20',
                data: filteredData.mean,
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                borderColor: 'rgba(0, 0, 255, 0.2)',
                borderWidth: 2,
                pointRadius: 0,
                id: 'datasetsma20'
            },
            {
                label: 'Bande sup',
                data: filteredData.mean.map((elt, idx) => elt + filteredData.stddev[idx] * facteur),
                borderColor: 'rgba(0, 255, 0, 1)',
                backgroundColor: 'rgba(0, 255, 0, 1)',
                borderWidth: 2,
                pointRadius: 0,
                id: 'datasetbandesup'
            },
            {
                label: 'Bande inf',
                data: filteredData.mean.map((elt, idx) => elt - filteredData.stddev[idx] * facteur),
                borderColor: 'rgba(255, 200, 0, 1)',
                backgroundColor: 'rgba(183, 165, 113, 0.3)',
                borderWidth: 2,
                pointRadius: 0,
                fill: {
                    target: 2,
                    above: 'rgba(255, 200, 0, 1)'
                }
            },  
        ],
    };

    const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
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
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Bande de Bollinger',
            }
        },
    };

    if (dateData.length === 0 || close.length === 0) {
        return <div>Chargement des données...</div>;
    }

    return <>
        <div id="bollingerband">
            <Line data={data} options={options} ref={chartRef} />
        </div>
        <div>
                Les choses à vérifier sur ce graphique :
                <ul>
                    <li>
                        Dès lors que je sors par le dessous des bandes de Bollinger, alors il y a une opportunité pour rentrer dans le marché !
                        Faire attention tout de même à l'actualité qui peut amener à des situations différentes.
                    </li>
                    <li>
                        Dès lors que je sors par le dessus des bandes de Bollinger, alors il y a une opportunité pour vendre !
                        Faire attention tout de même à l'actualité qui peut amener à des situations différentes.
                    </li>
                    <li>
                        Pour savoir <b>quand acheter</b>:
                        <ul>
                            <li>
                                 La bougie doit fermer <b>au-moins 1,5%</b> en dessous des bandes de Bollinger
                            </li>
                            <li>
                                (ou) La bougie doit ouvrir <b>au-moins 1,5%</b> en dessous des bandes de Bollinger de la veille 
                            </li>
                        </ul>
                        Comment positionner son argent ?
                        <ul>
                            <li>
                                Mettre x% à l'ouverture
                            </li>
                            <li>
                                Mettre 0,5x% à l'ouverture - 2,5%
                            </li>
                            <li>
                                Mettre 1,25x% à l'ouverture - 3,3%
                            </li>
                            <li>
                                Avec un stop-loss à -4,5%
                            </li>
                        </ul>
                    </li>
                    <li>
                        Pour savoir <b>quand vendre</b> avec un bon profit :
                        Une statégie est de mettre en place des "stop-loss" qui va permettre d'éviter de faire perdre trop d'argent sur une transaction donnée.
                        <ul>
                            <li>
                                Si +6,5% par rapport au premier achat, il faut vendre de suite
                            </li>
                            <li>
                                Si atteint +4%, on déplace le stop-loss à +2.5%.
                            </li>
                            <li>
                                Si atteint +5%, on déplace le stop-loss à +3.5%.
                            </li>
                            <li>
                                Si atteint +6%, on déplace le stop-loss à +4.5%.
                            </li>
                        </ul>
                    </li>
                    <li>
                        https://www.youtube.com/watch?v=7XXv3QBqFfY
                    </li>
                </ul>
            </div>
    </>
}

export default BollingerBand;