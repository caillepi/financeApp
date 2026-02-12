import GeneralChart from '../component/GeneralChart.jsx';
import ResumeData from '../component/ResumeData.jsx';
import ChartChooser from '../component/ChartChooser.jsx';
import PeriodSwitcher from '../component/PeriodSwitcher.jsx';
import { useAuthentification } from '../hook/useAuthentication.jsx';
import { useNavigation } from '../hook/useNavigation.jsx';
import { useEffect } from 'react';
import { useTicker } from '../hook/useTicker.jsx';
import { Box, Grid, Stack } from '@mui/material';
import LayoutSidebar from "../component/LayoutSidebar";

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
            <Grid container >
                <LayoutSidebar
                    sidebar = {
                        <>
                            <h2 id='homepage-title'>
                                Actions
                            </h2>
                            <Stack gap={2}>
                                <PeriodSwitcher />
                                <ChartChooser />
                            </Stack>
                        </>
                    }
                    main = {
                        <Box className='homepage-content'>
                            <Box id='homepage-title'>
                                <span id='homepage-title-resume'>
                                    <ResumeData />
                                </span>
                            </Box>
                            <Box className='homepage-content-chart'>
                                <GeneralChart />
                            </Box>
                        </Box>
                    }
                />
            </Grid>
        </>
    }

}

export default HomePage;