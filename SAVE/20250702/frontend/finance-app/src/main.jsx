import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App.jsx'
import { PeriodContextProvider } from './hook/usePeriod.jsx'
import { ChartContextProvider } from './hook/useChart.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PeriodContextProvider>
      <ChartContextProvider>
        <App />
      </ChartContextProvider>
    </PeriodContextProvider>
  </StrictMode>,
)
