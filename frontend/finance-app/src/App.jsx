import { ThemeProvider } from '@mui/material/styles';
import './App.css'
import theme, { applyThemeToDocument } from './style/theme';
import { useEffect } from 'react';
import AppRouter from './component/AppRouter';

function App() {
    useEffect(() => {
        applyThemeToDocument(theme);
        console.log('Theme applied to document');
    }, []);

    return <>
        <div>
            <ThemeProvider theme={theme}>
                <AppRouter />
            </ThemeProvider>
        </div>
    </>
}

export default App;
