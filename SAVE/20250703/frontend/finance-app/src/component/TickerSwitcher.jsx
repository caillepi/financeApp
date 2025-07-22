import React, { useEffect, useState } from "react";
import { useTicker } from "../hook/useTicker";
import { getEnterpriseName } from "../utils/requests";

const TICKERS = [
    { name: "Airbus", code: "AIR.PA" },
    { name: "Thales", code: "HO.PA" },
    { name: "L'Oréal", code: "OR.PA" },
    { name: "Total", code: "FP.PA" },
    { name: "Sanofi", code: "SAN.PA" },
    { name: "Danone", code: "BN.PA" },
    { name: "BNP Paribas", code: "BNP.PA" },
    { name: "Société Générale", code: "GLE.PA" },
    { name: "Carrefour", code: "CA.PA" },
    { name: "Vinci", code: "DG.PA" },
    { name: "AXA", code: "CS.PA" },
    { name: "Clariane", code: "CLARI.PA" },
    { name: "Parrot", code: "PARRO.PA" },
    { name: "Bouygues", code: "EN.PA" },
    { name: "OVH", code: "OVH.PA" },
    { name: "Alstom", code: "ALO.PA" },
    { name: "TF1", code: "TFI.PA" },
    { name: "Crédit Agricole", code: "ACA.PA" }
];


function TickerSwitcher() {
    const { ticker, changeTicker } = useTicker();
    const [enterpriseName, setEnterpriseName] = useState("");

    const handleChange = async (e) => {
        const newTicker = e.target.value;
        changeTicker(newTicker); // met à jour le context
    };

    return (
        <div id="tickerswitcher">
            <label htmlFor="ticker-select">Sélectionnez un ticker :</label>
            <select id="ticker-select" value={ticker} onChange={handleChange}>
                {TICKERS.map(({ name, code }) => (
                    <option key={code} value={code}>
                        {name} ({code})
                    </option>
                ))}
            </select>
        </div>
    );
}

export default TickerSwitcher;