import React from "react";
import { useTicker } from "../hook/useTicker";
import { useTickersList } from "../hook/useTickerList";

function TickerSwitcher() {
    const { ticker, changeTicker } = useTicker();
    const { tickersList } = useTickersList();


    const handleChange = async (e) => {
        const newTicker = e.target.value;
        changeTicker(newTicker); // met à jour le context
    };

    return (
        <div id="tickerswitcher">
            <label htmlFor="ticker-select"></label>
            <select id="ticker-select" value={ticker ?? ""} onChange={handleChange}>
                {tickersList !== null && tickersList.map(({ name, code, is_active }) => (
                    <option key={code} value={code} style={{ fontWeight: is_active === 1 ? 700 : 300 }}>
                        {name} ({code})
                    </option>
                ))}
            </select>
        </div>
    );
}

export default TickerSwitcher;