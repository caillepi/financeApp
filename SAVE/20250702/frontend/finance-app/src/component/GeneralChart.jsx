import CloseData from './CloseData';
import './GeneralChart.css'
import { useEffect, useState } from 'react';
import { getDateData, getMax, getMin } from '../utils/requests';
import Candlestick from './CandlestickData';
import Macd from './Macd';
import BollingerBand from './BollingerBand';
import { useChart } from '../hook/useChart';

function GeneralChart () {
    const [date, setDate] = useState([]);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const [min, setMin] = useState(null);
    const [max, setMax] = useState(null);
    const [isAnnotationDisplay, setIsAnnotationDisplay] = useState(false);

    useEffect(() => {
        const fetchDate = async () => {
            let dateData = await getDateData();
            setDate(dateData);
        }

        const fetchMinMax = async () => {
            let mini = await getMin();
            setMin(mini);
            let maxi = await getMax();
            setMax(maxi);
        }

        fetchDate();
        fetchMinMax();

    }, []);

    const dataProps = {
        dateData: date, 
        mouseX: mouseX, 
        mouseY: mouseY, 
        setMouseX: setMouseX, 
        setMouseY: setMouseY, 
        min: min,
        max: max, 
        isAnnotationDisplay: isAnnotationDisplay, 
        //setIsAnnotationDisplay: setIsAnnotationDisplay
    };

    const { chart } = useChart();

    return <>
        <div id="generalchart">
            <div className='generalchart-charts'>
                {
                    chart === "CLOSE_CHART" &&
                        <div className='generalchart-closedata'>
                            <CloseData {...dataProps} />
                        </div>
                }
                {
                    chart === "BOLLINGER_BAND_CHART" &&
                        <div className="generalchart-bollingerband">
                            <BollingerBand {...dataProps} />
                        </div>
                }
                {
                    chart === "MACD_CHART" &&
                        <div className="generalchart-macd">
                            <Macd {...dataProps} />
                        </div>
                }
                {
                    chart === "CANDLESTICK_CHART" &&
                        <div className="generalchart-macd">
                            <Candlestick {...dataProps} />
                        </div>
                }
            </div>
        </div>
    </>
}

export default GeneralChart;
