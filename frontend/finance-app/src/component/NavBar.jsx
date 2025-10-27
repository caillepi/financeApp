import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';
import TickerSwitcher from "./TickerSwitcher";
import { useNavigation } from '../hook/useNavigation.jsx';
import { useAuthentification } from '../hook/useAuthentication.jsx';

function NavBar () {
    const location = useLocation();
    const { navigate } = useNavigation();
    const { logout } = useAuthentification();

    if (location.pathname === '/login') {
        return <>
            <div>
                <h1>Connexion</h1>
            </div>
        </>
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

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
                <div className="navbar-item">
                    <button onClick={handleLogout}>SE DECONNECTER</button>
                </div>
            </div>
        </div>
    </>
}

export default NavBar;