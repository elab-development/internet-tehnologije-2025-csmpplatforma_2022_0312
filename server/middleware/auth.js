const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Token se obično šalje u Header-u pod nazivom 'Authorization'
    const token = req.header('Authorization');

    if (!token) {
        return res.status(403).json({ message: "Pristup odbijen. Nema tokena." });
    }

    try {
        // 'tajni_kljuc_2025' mora biti isti kao onaj koji koristiš pri generisanju tokena
        const verified = jwt.verify(token, 'tajni_kljuc');
        req.user = verified;
        next(); // Sve je u redu, pusti zahtev dalje do kontrolera
    } catch (err) {
        res.status(401).json({ message: "Nevalidan token." });
    }
};

module.exports = verifyToken;