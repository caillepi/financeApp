import { useEffect, useState } from 'react';
import './VolumeData.css';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getVolumeData } from '../utils/requests';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

function VolumeData ({dateData, mouseX, mouseY, setMouseX, setMouseY, isAnnotationDisplay, setIsAnnotationDisplay}) {
    const [volume, setVolume] = useState([]);

    useEffect(() => {
        const fetchVolumeData = async () => {
            let result = await getVolumeData();
            setVolume(result);
        }

        fetchVolumeData();
    }, []);

    const handleOnClick = (e) => {
        setIsAnnotationDisplay(!isAnnotationDisplay);
        chartRef.current.update();
    }

    // Données pour le graphique
        const data = {
            labels: dateData,
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
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        xMin: mouseX,
                        xMax: mouseX,
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 2,
                        display: isAnnotationDisplay,
                    }
                }
            }
            },
        };
    
        if (dateData.length === 0 || volume.length === 0) {
            return <div>Chargement des données...</div>;
        }
    
        return (<>
            <div id="volumedata">
                <Line data={data} options={options} onClick={handleOnClick}/>
            </div>
        </>)
};

export default VolumeData;