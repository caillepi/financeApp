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
            <div id="periodswitcher-4"
                 className="period-choice"
                 data-value="TWO_YEARS"
                 onClick={handleOnChangePeriod}
                 >
                2 ANS
            </div>
            <div id="periodswitcher-4"
                 className="period-choice"
                 data-value="FIVE_YEARS"
                 onClick={handleOnChangePeriod}
                 >
                5 ANS
            </div>
        </div>
    </>
}

export default PeriodSwitcher;