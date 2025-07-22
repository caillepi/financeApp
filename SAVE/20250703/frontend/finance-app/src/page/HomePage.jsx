import GeneralChart from '../component/GeneralChart.jsx';
import './HomePage.css';
import ResumeData from '../component/ResumeData.jsx';
import ChartChooser from '../component/ChartChooser.jsx';
import PeriodSwitcher from '../component/PeriodSwitcher.jsx';
import { useTicker } from "../hook/useTicker";

function HomePage () {
    return <>
        <div id='homepage'>
            <div id='homepage-title'>
                <span id='homepage-title-resume'>
                    <ResumeData />
                </span>
                <span id='homepage-title-chooser'>
                    <ChartChooser />
                </span>
                <span id='homepage-title-period'>
                    <PeriodSwitcher />
                </span>
            </div>
            <div className='homepage-content'>
                <div className='homepage-content-chart'>
                    <GeneralChart />
                </div>
            </div>
        </div>
    </>
}

export default HomePage;