import { useEffect, useMemo, useState } from 'react';
import './VolumeData.css';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getVolumeData } from '../utils/requests';
import { useTicker } from '../hook/useTicker';
import { usePeriod } from '../hook/usePeriod';
import { DateTime } from 'luxon';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

function VolumeData ({ dateData }) {
    const [volume, setVolume] = useState([]);
    let { ticker } = useTicker();
    const { period } = usePeriod();

    useEffect(() => {
        const fetchData = async () => {
            setVolume(await getVolumeData(ticker));
        }

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
        volume: volume.slice(minIndex),
        dates: dateData.slice(minIndex)
    }), [volume, dateData, minIndex]);

    // Données pour le graphique
    const data = {
        labels: filteredData.dates,
        datasets: [
            {
                label: 'Volume',
                data: volume,
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
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Volume acheté',
            },
        },
    };
    
    if (dateData.length === 0 || volume.length === 0) {
        return <div>Chargement des données...</div>;
    }

    return (<>
        <div id="volumedata">
            <Line data={data} options={options}/>
        </div>
    </>)
};

export default VolumeData;