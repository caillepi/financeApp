import React, { useEffect } from "react";
import TickerList from "../component/TickerList";
import { useNavigation } from "../hook/useNavigation";
import { useAuthentification } from "../hook/useAuthentication";

function TickerPage () {
    const { navigate } = useNavigation();
    const { isAuthenticated } = useAuthentification();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) {
        // Pendant que la redirection s’effectue, on ne rend rien
        return null;
    }

    return <>
        <div id="tickerpage">
            <TickerList />
        </div>
    </>
}

export default TickerPage;