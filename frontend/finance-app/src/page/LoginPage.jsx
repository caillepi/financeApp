import React, { useEffect, useState } from "react";
import { useNavigation } from "../hook/useNavigation";
import { useAuthentification } from "../hook/useAuthentication";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import CustomContainer from "../component/ui/customcontainer";
import { Grid, Typography } from "@mui/material";

function LoginPage () {
    const [form, setForm] = useState({
        username: 'admin',
        password: 'password123'
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const { navigate } = useNavigation();
    const { setIsAuthenticated, login } = useAuthentification();

    const handleFormChange = (e) => {
        const { id, value } = e.target;
        setForm({
            ...form,
            [id]: value
        });
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setTimeout(() => {}, 1000); // Simule un délai pour le chargement
        
        try {
            setIsLoading(true);
            const response = await login(form);
            setIsLoading(false);
            if (response.status === 200) {
                setError(false);
                setIsAuthenticated(true);
                navigate("./../");       
                setMessage(response.message);
            }
            else {
                setError(true);
                setMessage(response);
            }
        } catch (error) {
            console.log('Erreur lors de la connexion');
        }
    };

    return <>
        <CustomContainer
            variant="fullScreen"
            disableGutters={false}
            sx={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'background.default',
                color: 'text.primary'
            }}
        >
            <Grid container 
                spacing={2} 
                sx={{ 
                    m: 0,
                    p: { xs: 2, sm: 3, md: 3 },
                    pb: 5,
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 3
                }}
                width={{}}
                size = {{xs: 12, sm: 8, md: 6, lg: 4}}
            >
                <h2>Connexion</h2>
                
                <Box
                    component="form"
                    onSubmit={handleLogin}
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    <FormControl>
                        <FormLabel 
                            htmlFor="username"
                        >
                            Nom d'utilisateur
                        </FormLabel>
                        <TextField
                            id="username"
                            type="text"
                            value={form.username}
                            onChange={handleFormChange}
                            required
                            fullWidth
                            variant="outlined"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel 
                            htmlFor="password"
                        >
                            Mot de passe
                        </FormLabel>
                        <TextField
                            id="password"
                            type="password"
                            value={form.password}
                            onChange={handleFormChange}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        color = {isLoading ? 'secondary' : error ? 'error' : 'primary'} 
                    >
                        Connexion
                    </Button>
                </Box>
            </Grid>
            <Grid container 
                spacing={2} 
                sx={{
                    mt: 2,
                    color: 'text.secondary',
                }}
            >
                <Grid item xs={12} sx={{ textAlign: 'center', fontSize: '0.8em' }}>
                    {message && <Typography color={error ? "error.main" : "success.main"}>{message}</Typography>}
                </Grid>
            </Grid>
        </CustomContainer>
    </>
}

export default LoginPage;