const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Simuler une base de données des utilisateurs (pour l'exemple)
const users = [
    { id: 1, username: 'admin', password: '$2b$10$0dB3LS0MnFcmeSdgn/3UiOLbUFt51DyzVsn.o/GckqaUiOSB6bQai'} // password123 pour l'exemple
];

// Route de connexion
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (user) {
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (isMatch) {
                req.session.user = user;
                return res.status(200).json({ message: 'Connexion réussie', user: req.session.user });
            } else {
                return res.status(400).json({ message: 'Identifiants incorrects', user: null });
            }
        });
    } else {
        return res.status(400).json({ message: 'Utilisateur non trouvé', user: null });
    }
});

// Route de déconnexion
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
        }
        res.clearCookie('connect.sid'); // Effacer le cookie de session
        return res.status(200).json({ message: 'Déconnexion réussie', user: null });
    });
});

// Route pour vérifier si l'utilisateur est authentifié
router.get('/check-auth', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ isAuthenticated: true });
    } else {
        res.status(401).json({ isAuthenticated: false });
    }
});

module.exports = router;