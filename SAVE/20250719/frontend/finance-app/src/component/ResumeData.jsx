import { useEffect, useState } from "react";
import { useTicker } from "../hook/useTicker";
import './ResumeData.css';
import '../utils/general.css';
import '../utils/color.css';
import '../utils/font.css';
import { getCurrent, getEnterpriseName, getHigh, getLastClose, getLastOpen, getLow, getMax, getMin } from "../utils/requests";
import { usePeriod } from "../hook/usePeriod";

function ResumeData () {
    const [enterpriseName, setEnterpriseName] = useState(null);
    const [current, setCurrent] = useState(null);
    const [low, setLow] = useState(null);
    const [high, setHigh] = useState(null);
    const [lastOpen, setLastOpen] = useState(null);
    const [lastClose, setLastClose] = useState(null);
    const [min, setMin] = useState(null);
    const [max, setMax] = useState(null);
    
    
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
        };

        fetchData();
    }, [ticker, period])

    return <>
        <div id='resumedata'>
            <div id="resumedata-firstpart">
                <div className="bold">
                    {enterpriseName}
                </div>
                <div>
                    <span className={isDeltaPositive ? "green" : "red"}>{delta > 0 ? "+ " : ""} {delta} EUR</span> ({parseFloat((current - lastClose)*100/lastClose).toFixed(2)}%)
                </div>
            </div>
            <div id="resumedata-secondpart">
                <div className="resumedata-secondpart-current">
                    <span className="resumedata-secondpart-description">
                        Current price
                    </span>
                    <span className="resumedata-secondpart-right">
                        <span className="resumedata-secondpart-value">
                            {current}
                        </span>
                        <span className="resumedata-secondpart-currency">
                            EUR
                        </span>
                    </span>
                </div>
                <div className="resumedata-secondpart-previousclose">
                    <span className="resumedata-secondpart-description">
                        Previous close
                    </span>
                    <span className="resumedata-secondpart-right">
                        <span className="resumedata-secondpart-value">
                            {lastClose}
                        </span>
                        <span className="resumedata-secondpart-currency">
                            EUR
                        </span>
                    </span>
                </div>
                <div className="resumedata-secondpart-open">
                    <span className="resumedata-secondpart-description">
                        Open
                    </span>
                    <span className="resumedata-secondpart-right">
                        <span className="resumedata-secondpart-value">
                            {lastOpen}
                        </span>
                        <span className="resumedata-secondpart-currency">
                            EUR
                        </span>
                    </span>
                </div>
                <div className="resumedata-secondpart-highlow">
                    <span className="resumedata-secondpart-description">
                        Day High / Low
                    </span>
                    <span className="resumedata-secondpart-right">
                        <span className="resumedata-secondpart-value">
                            {high} / {low}
                        </span>
                        <span className="resumedata-secondpart-currency">
                            EUR
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </>
}

export default ResumeData;