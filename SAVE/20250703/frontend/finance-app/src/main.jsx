import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App.jsx'
import { PeriodContextProvider } from './hook/usePeriod.jsx'
import { ChartContextProvider } from './hook/useChart.jsx'
import { TickerContextProvider } from './hook/useTicker.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TickerContextProvider>
      <PeriodContextProvider>
        <ChartContextProvider>
          <App />
        </ChartContextProvider>
      </PeriodContextProvider>
    </TickerContextProvider>
  </StrictMode>,
)
