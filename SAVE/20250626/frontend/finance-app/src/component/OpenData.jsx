import React, { useEffect, useRef, useState } from 'react';
import './OpenData.css';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getOpenData } from '../utils/requests';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

function OpenData ({dateData, mouseX, mouseY, setMouseX, setMouseY, min, max, isAnnotationDisplay, setIsAnnotationDisplay}) {
    const [open, setOpen] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchOpenData = async () => {
            let result = await getOpenData();
            setOpen(result);
        };

        fetchOpenData();
    }, []);

    const handleOnMouseMove = (e) => {
        if (chartRef.current) {
            const rect = chartRef.current.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xAxis = chartRef.current.scales['x'];
            const yAxis = chartRef.current.scales['y'];

            const xValue = xAxis.getValueForPixel(x);
            const yValue = yAxis.getValueForPixel(y);

            if (xValue >= 0 && xValue <= 22) {
                setMouseX(xValue);
            } 

            setMouseY(yValue);
        }
    }

    const handleOnClick = (e) => {
        setIsAnnotationDisplay(!isAnnotationDisplay);
        chartRef.current.update();
    }

    // Données pour le graphique
    const data = {
        labels: dateData,
        datasets: [
            {
                label: 'Prix d\'ouverture',
                data: open,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointRadius: 0,
            },
        ],
    };

    // Options pour le graphique
    const options = {
        responsive: true,
        scales: {
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
                    }
                }
            }
        },
    };

    if (dateData.length === 0 || open.length === 0) {
        return <div>Chargement des données...</div>;
    }

    return <>
        <div id="opendata">
            <Line data={data} options={options} ref={chartRef} onClick={handleOnClick} onMouseMove={handleOnMouseMove}/>
        </div>
    </>
}

export default OpenData;


