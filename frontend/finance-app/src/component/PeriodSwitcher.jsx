import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { usePeriod } from "../hook/usePeriod";

function PeriodSwitcher() {
    const { period, changePeriod } = usePeriod();

    const handleOnChangePeriod = (e) => {
        changePeriod(e.target.value);
    }

    return <>
        <FormControl fullWidth 
            id="periodswitcher"
            sx={{
                p: 0,
                m: 0,
                backgroundColor: "transparent"
            }}>
            <InputLabel id='periodswitcher-label'>Durée</InputLabel>
            <Select
                labelId="periodswitcher-label"
                id="periodswitcher"
                value={period}
                label="period"
                onChange={handleOnChangePeriod}
            >
                <MenuItem value="ONE_WEEK">1W</MenuItem>
                <MenuItem value="ONE_MONTH">1M</MenuItem>
                <MenuItem value="SIX_MONTHS">6M</MenuItem>
                <MenuItem value="ONE_YEAR">1Y</MenuItem>
                <MenuItem value="TWO_YEAR">2Y</MenuItem>
                <MenuItem value="FIVE_YEAR">5Y</MenuItem>
            </Select>
        </FormControl>
    </>
}

export default PeriodSwitcher;