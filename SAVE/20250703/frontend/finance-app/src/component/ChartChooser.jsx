import { useChart } from "../hook/useChart";
import './ChartChooser.css'

function ChartChooser () {
    const { changeChart } = useChart();

    const handleOnClick = (e) => {
        changeChart(e.target.dataset.value)
    }

    return <>
        <div id="chartchooser">
            <div id="chooser-1" 
                 className="chooser-choice"
                 data-value="CLOSE_CHART"
                 onClick={handleOnClick}>
                Clôture
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
                Bande de Bollinger
            </div>
            <div id="chooser-4" 
                 className="chooser-choice"
                 data-value="MACD_CHART"
                 onClick={handleOnClick}>
                MACD
            </div>
        </div>
    </>
}

export default ChartChooser;