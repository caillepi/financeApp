import GeneralChart from '../component/GeneralChart.jsx';
import './HomePage.css';
import ResumeData from '../component/ResumeData.jsx';
import ChartChooser from '../component/ChartChooser.jsx';
import PeriodSwitcher from '../component/PeriodSwitcher.jsx';
import { useAuthentification } from '../hook/useAuthentication.jsx';
import { useNavigation } from '../hook/useNavigation.jsx';
import { useEffect } from 'react';
import { useTicker } from '../hook/useTicker.jsx';
import { Toolbar } from '@mui/material';

function HomePage () {
    const { navigate } = useNavigation();
    const { isAuthenticated } = useAuthentification();
    const { ticker } = useTicker();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated || !ticker) {
        // Pendant que la redirection s’effectue, on ne rend rien
        return null;
    }

    if (isAuthenticated) {
        return <>
            <div id='homepage'>
                <Toolbar disableGutters/>
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

}

export default HomePage;