import { ThemeProvider } from '@mui/material/styles';
import './App.css'
import theme, { applyThemeToDocument } from './style/theme';
import { useEffect } from 'react';
import AppRouter from './component/AppRouter';
import { useTickersList } from './hook/useTickerList';
import { ReportDataContextProvider } from './hook/useReportData';

function App() {
    const { tickersList } = useTickersList();
    useEffect(() => {
        applyThemeToDocument(theme);
        console.log('Theme applied to document');
    }, []);

    return <>
        <div>
            <ReportDataContextProvider tickersList={tickersList}>
                <ThemeProvider theme={theme}>
                    <AppRouter />
                </ThemeProvider>
            </ReportDataContextProvider>
        </div>
    </>
}

export default App;
