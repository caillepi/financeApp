import React, { useState } from "react";
import { useNavigation } from "../hook/useNavigation";
import { useAuthentification } from "../hook/useAuthentication";

function LoginPage () {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('password123');
    const [message, setMessage] = useState('');

    const { navigate } = useNavigation();
    const { setIsAuthenticated, login } = useAuthentification();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await login(username, password);
            if (response.status === 200) {
                setIsAuthenticated(true);
                navigate("./../");
                setMessage(response.message);
            }
        } catch (error) {
            console.log('Erreur lors de la connexion');
        }
    };

    return <>
        <div id="login">
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Nom d'utilisation" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Connexion</button>
            </form>
            {message};
        </div>
    </>
}

export default LoginPage;