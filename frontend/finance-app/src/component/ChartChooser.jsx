import { useChart } from "../hook/useChart";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function ChartChooser () {
    const { chart, changeChart } = useChart();

    const handleOnChangeChart = (e) => {
        changeChart(e.target.value);
    }

    return <>
        <FormControl fullWidth
        >
            <InputLabel id="chartchooser-label">Chart chooser</InputLabel>
            <Select
                labelId="chartchosser-label"
                id="chartchooser"
                label="Chart Chooser"
                value={chart}
                onChange={handleOnChangeChart}
            >
                <MenuItem value="CLOSE_CHART">Clôture</MenuItem>
                <MenuItem value="CANDLETICK_CHART">Bougie</MenuItem>
                <MenuItem value="BOLLINGER_BAND_CHART">Bollinger</MenuItem>
                <MenuItem value="MACD_CHART">MACD</MenuItem>
                <MenuItem value="RSI_CHART">RSI</MenuItem>
                <MenuItem value="VOLUME_CHART">Volume</MenuItem>
            </Select>
        </FormControl>
    </>
}

export default ChartChooser;