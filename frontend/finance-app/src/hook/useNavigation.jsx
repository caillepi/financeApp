import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const NavigationContext = createContext({
    navigation : '/',
    redirectToLogin: () => {}
});

export function useNavigation() {
    return useContext(NavigationContext);
}

export function NavigationContextProvider({children}) {
    const navigate = useNavigate();

    const redirectToLogin = () => {
        navigate('/login');
    }

    return <>
        <NavigationContext.Provider value={{
            navigate,
            redirectToLogin
        }}>
            {children}
        </NavigationContext.Provider>
    </>
}   