import { usePeriod } from "../hook/usePeriod";
import './PeriodSwitcher.css'

function PeriodSwitcher() {
    const { changePeriod } = usePeriod();

    const handleOnChangePeriod = (e) => {
        changePeriod(e.target.dataset.value);
    }

    return <>
        <div id="periodswitcher">
            <div id="periodswitcher-1"
                 className="period-choice"
                 data-value="ONE_WEEK"
                 onClick={handleOnChangePeriod}
                 >
                1 SEMAINE
            </div>
            <div id="periodswitcher-2"
                 className="period-choice"
                 data-value="ONE_MONTH"
                 onClick={handleOnChangePeriod}
                 >
                1 MOIS
            </div>
            <div id="periodswitcher-3"
                 className="period-choice"
                 data-value="SIX_MONTHS"
                 onClick={handleOnChangePeriod}
                 >
                6 MOIS
            </div>
            <div id="periodswitcher-4"
                 className="period-choice"
                 data-value="ONE_YEAR"
                 onClick={handleOnChangePeriod}
                 >
                1 AN
            </div>
        </div>
    </>
}

export default PeriodSwitcher;

/*
<div className="periodswitcher-control">
                <label htmlFor="period-select">Période :</label>
                <select id="period-select" value={period} onChange={handleOnChangePeriod}>
                    <option value="ONE_YEAR">1 an</option>
                    <option value="SIX_MONTHS">6 mois</option>
                    <option value="ONE_MONTH">1 mois</option>
                    <option value="ONE_WEEK">1 semaine</option>
                </select>
            </div>
*/