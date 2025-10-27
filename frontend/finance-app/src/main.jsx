import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import { PeriodContextProvider } from './hook/usePeriod.jsx'
import { ChartContextProvider } from './hook/useChart.jsx'
import { TickerContextProvider } from './hook/useTicker.jsx'
import AppRouter from './component/AppRouter.jsx'
import { TickersListContextProvider } from './hook/useTickerList.jsx'
import { AuthentificationContextProvider } from './hook/useAuthentication.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthentificationContextProvider>
      <TickersListContextProvider>
        <TickerContextProvider>
          <PeriodContextProvider>
            <ChartContextProvider>
                <AppRouter />
            </ChartContextProvider>
          </PeriodContextProvider>
        </TickerContextProvider>
      </TickersListContextProvider>
    </AuthentificationContextProvider>
  </StrictMode>,
)
