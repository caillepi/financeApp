import React from "react";
import TickerList from "../component/TickerList";
import { addTicker } from "../utils/requests";

function TickerPage () {
    return <>
        <div id="tickerpage">
            <TickerList />
        </div>
    </>
}

export default TickerPage;