function isAuthenticated (req, res, next) {
    if (req.session.user) {
        return next(); // L'utilisateur est authentifié, on continue la route
    } else {
        return res.status(401).json({ message: 'Non autorisé. Veuillez vous connecter.' });
    }
};

module.exports = {
    isAuthenticated
}