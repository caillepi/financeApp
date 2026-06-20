import { useTicker } from "../hook/useTicker";
import '../utils/general.css';
import '../utils/color.css';
import '../utils/font.css';
import { computeScore } from "../utils/score";
import { usePeriod } from "../hook/usePeriod";
import { Box, CircularProgress, Grid } from "@mui/material";
import { useTickerData } from "../hook/useTickerData";

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
    let { ticker } = useTicker();
    let { period } = usePeriod();
    let { data, loading } = useTickerData(ticker, period);

    if (loading || !data) 
        return <>
            <Box sx={{ display: 'flex' }}>
                <CircularProgress color="success"/>
            </Box>
        
        </>
    if (loading) return <div>Chargement...</div>;
    if (!data) return null;
     
    const {
        enterpriseName,
        current,
        low,
        high,
        lastOpen,
        lastClose,
        dividend,
        averageAnalystRating,
        kpiSma,
        kpiBollinger,
        kpiMacd,
        kpiRsi
    } = data;

    const safeDividend = dividend || { dividend: 'N/A', dividendRate: null };

    let delta = parseFloat(current - lastClose).toFixed(2);
    let isDeltaPositive = delta > 0;

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
                        <ShowData label = "dernier dividende" data = {safeDividend.dividend ?? 'N/A'} />
                </Grid>

                {/* Right column */}
                <Grid container item direction="column" size={6}
                    sx={{ justifyContent: "center", alignItems: 'flex-start' }}
                >
                    <ShowData label = "clôture veille" data = {lastClose} />
                    <ShowData label = "+ bas" data = {low} />
                    <ShowData label = "% dividende" data = {safeDividend.dividendRate !== null && safeDividend.dividendRate !== undefined ? (safeDividend.dividendRate * 100).toFixed(2) : 'N/A'} />
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
                    <ShowData label = "Analyst Rating" data = {averageAnalystRating} />
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