import { useEffect, useState } from "react";
import { useTicker } from "../hook/useTicker";
import '../utils/general.css';
import '../utils/color.css';
import '../utils/font.css';
import { computeScore } from "../utils/score";
import { getCurrent, getDividend, getEnterpriseName, getHigh, getLastClose, getLastOpen, getLow, getMax, getMin, getKpiBollinger, getKpiMacd, getKpiRsi, getKpiSma } from "../utils/requests";
import { usePeriod } from "../hook/usePeriod";
import { Grid } from "@mui/material";

function ShowData ({label, data}) {
    return <>
        <Grid
            item
            direction="column"
            xs={12}
            sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}
        >
            <Grid item
                xs={12}
                sx={{ color: "grey", fontWeight: "600", textTransform: "uppercase", fontSize: '0.7em', marginBottom: '3px' }}
            >
                {label}
            </Grid>
            <Grid item
                xs={12}
                sx={{ color: "black", fontWeight: "600", fontSize: '0.9em' }}
            >
                    {data}
            </Grid>
        </Grid>
    </>
}

function ResumeData () {
    const [enterpriseName, setEnterpriseName] = useState(null);
    const [current, setCurrent] = useState(null);
    const [low, setLow] = useState(null);
    const [high, setHigh] = useState(null);
    const [lastOpen, setLastOpen] = useState(null);
    const [lastClose, setLastClose] = useState(null);
    const [kpiSma, setKpiSma] = useState(50);
    const [kpiBollinger, setKpiBollinger] = useState(50);
    const [kpiMacd, setKpiMacd] = useState(50);
    const [kpiRsi, setKpiRsi] = useState(50);
    const [volume, setVolume] = useState(null);
    const [min, setMin] = useState(null);
    const [max, setMax] = useState(null);
    const [dividend, setDivident] = useState([]);
    
    
    let delta = parseFloat(current - lastClose).toFixed(2);
    let isDeltaPositive = delta > 0;
    let { ticker } = useTicker();
    let { period } = usePeriod();

    useEffect(() => {
        const fetchData = async () => {
            setEnterpriseName(await getEnterpriseName(ticker));
            setCurrent(await getCurrent(ticker));
            setLow(await getLow(ticker));
            setHigh(await getHigh(ticker));
            setLastOpen(await getLastOpen(ticker));
            setLastClose(await getLastClose(ticker));
            setMin(await getMin(ticker, period));
            setMax(await getMax(ticker, period));
            setDivident(await getDividend(ticker));
            setKpiSma(await getKpiSma(ticker));
            setKpiBollinger(await getKpiBollinger(ticker));
            setKpiMacd(await getKpiMacd(ticker));
            setKpiRsi(await getKpiRsi(ticker));
        };

        fetchData();
        
    }, [ticker, period]);

    return <>
        <Grid container direction="row" spacing={2}
            sx={{ justifyContent: "flex-start", alignItems: "flex-start", width: "100%", maxHeight: "149px"}}
        >
            {/* First column */}
            <Grid container item direction="column" size={4} spacing={1}
                sx={{ justifyContent: 'space-between', alignItems: 'flex-start', height: '149px', borderRight: "black solid 1px", py: 2 }}
            >
                {/* Company */}
                <Grid item size = {12} sx={{ fontWeight: '600', fontSize: '1.5em' }}>
                    {enterpriseName}
                </Grid>

                {/* Current Stock Value */}
                <Grid item size = {12}>
                    <ShowData label = "cours actuel" data = {current} />
                </Grid>

                {/* Compared to yesterday */}
                <Grid container item direction="row" size={12}
                    sx={{ justifyContent: "center", alignItems: 'flex-start' }}
                >
                    <Grid item size={6}>
                        <ShowData label = "delta" data = {delta} />
                    </Grid>
                    <Grid item size={6}>
                        <ShowData label = "% delta" data = {parseFloat((current - lastClose)*100/lastClose).toFixed(2)} />
                    </Grid>
                </Grid>
            </Grid>

            {/* Second column */}
            <Grid container item direction="row" size={4} spacing={1}
                sx={{ justifyContent: "center", alignItems: 'flex-start', borderRight: "black solid 1px", py: 2}}
            >
                {/* Left column */}
                <Grid container item direction="column" size={6}
                    sx={{ justifyContent: "center", alignItems: 'flex-start' }}
                >
                    <ShowData label = "ouverture" data = {lastOpen} />
                    <ShowData label = "+ haut" data = {high} />
                    <ShowData label = "dernier dividende" data = {dividend.dividend} />
                </Grid>

                {/* Right column */}
                <Grid container item direction="column" size={6}
                    sx={{ justifyContent: "center", alignItems: 'flex-start' }}
                >
                    <ShowData label = "clôture veille" data = {lastClose} />
                    <ShowData label = "+ bas" data = {low} />
                    <ShowData label = "% dividende" data = {(dividend.dividendRate * 100).toFixed(2) ?? 'N/A'} />
                </Grid>
            </Grid>

            {/* Third column */}
            <Grid container item direction="row" size={4} spacing={1}
                sx={{ justifyContent: "center", alignItems: 'flex-start', borderRight: "black solid 1px", py: 2 }}
            >
                {/* Left column */}
                <Grid container item direction="column" size={6}
                    sx={{ justifyContent: "center", alignItems: 'flex-start' }}
                >
                    <ShowData label = "Moyenne mobile" data = {kpiSma} />
                    <ShowData label = "RSI" data = {kpiRsi} />
                </Grid>

                {/* Right column */}
                <Grid container item direction="column" size={6}
                    sx={{ justifyContent: "center", alignItems: 'flex-start' }}
                >
                    <ShowData label = "MACD" data = {kpiMacd} />
                    <ShowData label = "Bollinger" data = {kpiBollinger} />
                    <ShowData label = "Score" data = {computeScore(kpiSma, kpiMacd, kpiBollinger, kpiRsi)} />
                </Grid>
            </Grid>
        </Grid>
    </>
}

export default ResumeData;