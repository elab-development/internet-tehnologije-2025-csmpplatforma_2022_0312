const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization'); 

    if (!token) {
        return res.status(403).json({ message: "Pristup odbijen. Nema tokena." });
    }

    try {
        const verified = jwt.verify(token, 'tajni_kljuc'); 
        req.user = verified;
        next(); 
    } catch (err) {
        res.status(401).json({ message: "Nevalidan token." });
    }
};

module.exports = verifyToken;