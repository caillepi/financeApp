import CloseData from './CloseData';
import './GeneralChart.css'
import { useEffect, useState } from 'react';
import { getDateData, getMax, getMin } from '../utils/requests';
import Candlestick from './CandlestickData';
import Macd from './Macd';
import BollingerBand from './BollingerBand';
import { useChart } from '../hook/useChart';
import { useTicker } from '../hook/useTicker';
import { usePeriod } from '../hook/usePeriod';
import RsiChart from './RsiChart';
import VolumeData from './VolumeData';

function GeneralChart () {
    const [date, setDate] = useState([]);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    let { ticker } = useTicker();
    let { period } = usePeriod();

    useEffect(() => {
        const fetchData = async () => {
            setDate(await getDateData(ticker));
            setMin(await getMin(ticker, period));
            setMax(await getMax(ticker, period));
        }

        fetchData();
    }, [ticker, period]);

    const dataProps = {
        dateData: date,
        min: min,
        max: max
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
                    chart === "CANDLESTICK_CHART" &&
                        <div className="generalchart-bollingerband">
                            <Candlestick {...dataProps} />
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
                    chart === "RSI_CHART" &&
                        <div className="generalchart-macd">
                            <RsiChart {...dataProps} />
                        </div>
                }
                {
                    chart === "VOLUME_CHART" &&
                        <div className="generalchart-macd">
                            <VolumeData {...dataProps} />
                        </div>
                }
            </div>
        </div>
    </>
}

export default GeneralChart;
