import { Link } from 'react-router-dom';
import './NavBar.css';
import TickerSwitcher from "./TickerSwitcher";

function NavBar () {
    return <>
        <div id="navbar">
            <div id="navbar-title">
                <Link to="/">financeApp</Link>
            </div>
            <div id="navbar-items">
                <div className="navbar-item">
                    <Link to="/report">Rapport</Link>
                </div>
                <div className="navbar-item">
                    <Link to="/ticker">Tickers Management</Link>
                </div>
                <div className="navbar-item">
                    <TickerSwitcher />
                </div>
            </div>
        </div>
    </>
}

export default NavBar;