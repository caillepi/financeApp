import { useEffect, useState } from "react";
import { useChart } from "../hook/useChart";
import './ChartChooser.css'
import { getKpiBollinger, getKpiMacd, getKpiSma } from "../utils/requests";
import { useTicker } from "../hook/useTicker";
import ProgressBar from "./ProgressBar";

function ChartChooser () {
    const [kpiSma, setKpiSma] = useState(50);
    const [kpiBollinger, setKpiBollinger] = useState(50);
    const [kpiMacd, setKpiMacd] = useState(70);
    const { changeChart } = useChart();
    const { ticker } = useTicker();

    useEffect(() => {
        let fetchData = async () => {
            setKpiSma(await getKpiSma(ticker));
            setKpiBollinger(await getKpiBollinger(ticker));
            setKpiMacd(await getKpiMacd(ticker));
        }

        fetchData();
    }, [ticker]);

    const handleOnClick = (e) => {
        changeChart(e.currentTarget.dataset.value)
    }

    return <>
        <div id="chartchooser">
            <div id="chooser-1" 
                 className="chooser-choice"
                 data-value="CLOSE_CHART"
                 onClick={handleOnClick}>
                <div className="chooser-content">
                    <div>Clôture ({kpiSma}%)</div>
                    <ProgressBar kpi={kpiSma} />
                </div>
            </div>
            <div id="chooser-2" 
                 className="chooser-choice"
                 data-value="CANDLESTICK_CHART"
                 onClick={handleOnClick}>
                Candlestick
            </div>
            <div id="chooser-3" 
                 className="chooser-choice"
                 data-value="BOLLINGER_BAND_CHART"
                 onClick={handleOnClick}>
                <div className="chooser-content">
                    <div>Bande de Bollinger</div>
                    <ProgressBar kpi={kpiBollinger} />
                </div>
            </div>
            <div id="chooser-4" 
                 className="chooser-choice"
                 data-value="MACD_CHART"
                 onClick={handleOnClick}>
                <div className="chooser-content">
                    <div>MACD</div>
                    <ProgressBar kpi={kpiMacd} />
                </div>
            </div>
            <div id="chooser-4" 
                 className="chooser-choice"
                 data-value="MACD_CHART"
                 onClick={handleOnClick}>
                RSI
            </div>
        </div>
    </>
}

export default ChartChooser;