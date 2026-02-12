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
import { Box, Grid } from '@mui/material';

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
        <Grid id="generalchart">
            <Box 
                className='generalchart-charts'
                sx={{
                    p: 0,
                    m: 0,
                    width: '100%'
                }}
            >
                {
                    chart === "CLOSE_CHART" &&
                        <Box className='generalchart-closedata'>
                            <CloseData {...dataProps} />
                        </Box>
                }
                {
                    chart === "CANDLESTICK_CHART" &&
                        <Box className="generalchart-bollingerband">
                            <Candlestick {...dataProps} />
                        </Box>
                }
                {
                    chart === "BOLLINGER_BAND_CHART" &&
                        <Box className="generalchart-bollingerband">
                            <BollingerBand {...dataProps} />
                        </Box>
                }
                {
                    chart === "MACD_CHART" &&
                        <Box className="generalchart-macd">
                            <Macd {...dataProps} />
                        </Box>
                }
                {
                    chart === "RSI_CHART" &&
                        <Box className="generalchart-macd">
                            <RsiChart {...dataProps} />
                        </Box>
                }
                {
                    chart === "VOLUME_CHART" &&
                        <Box className="generalchart-macd">
                            <VolumeData {...dataProps} />
                        </Box>
                }
            </Box>
        </Grid>
    </>
}

export default GeneralChart;
