import { createContext, useContext, useEffect, useState } from "react";
import { apiLogin, apiLogout, checkAuth } from "../utils/requests";

export const AuthentificationContext = createContext({
    isAuthenticated: false,
    user: '',
    setIsAuthenticated: () => {},
    changeIsAuthenticated: () => {},
    login: async () => {},
    logout: async () => {}
});

export function useAuthentification() {
    return useContext(AuthentificationContext);
}

export function AuthentificationContextProvider({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // empeche de flasher la page avant la verif
    
    useEffect(() => {
        async function checkSession() {
            try {
                const res = await checkAuth();
                if (res?.isAuthenticated) {
                    setUser(res.user);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (err) {
                console.warn("Session expirée ou non valide", err);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        }

        checkSession();
    }, [])
    
    const changeIsAuthenticated = () => {
        setIsAuthenticated(!isAuthenticated);
    }

    const login = async (form) => {
        const res = await apiLogin(form);
        if (res?.status === 200) {
            setUser(res.user);
            setIsAuthenticated(true);
            console.log(res.message);
        }
        return res;
    };

    const logout = async () => {
        let _ = await apiLogout();
        setUser(null);
        setIsAuthenticated(false);
    }

    if (loading) {
        return null;
    }

    return <>
        <AuthentificationContext.Provider value={{
            isAuthenticated,
            user,
            setIsAuthenticated,
            changeIsAuthenticated,
            login,
            logout
        }}>
            {children}
        </AuthentificationContext.Provider>
    </>
}