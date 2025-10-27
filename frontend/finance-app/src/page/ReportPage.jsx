import React, { useEffect } from "react";
import './ReportPage.css';
import ReportList from "../component/ReportList";
import { useAuthentification } from "../hook/useAuthentication";
import { useNavigation } from "../hook/useNavigation";

function ReportPage() {
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
        <div id="reportpage">
            <ReportList />
        </div>
    </>
}

export default ReportPage;