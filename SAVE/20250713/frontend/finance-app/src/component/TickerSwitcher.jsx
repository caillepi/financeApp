import React, { useEffect, useState } from "react";
import { useTicker } from "../hook/useTicker"
import { getTickers } from "../utils/requests";
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
            <select id="ticker-select" value={ticker} onChange={handleChange}>
                {tickersList.map(({ name, code, isActive }) => (
                    <option key={code} value={code} style={{ fontWeight: isActive === 1 ? 700 : 300 }}>
                        {name} ({code})
                    </option>
                ))}
            </select>
        </div>
    );
}

export default TickerSwitcher;