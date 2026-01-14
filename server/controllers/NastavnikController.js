const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.registerNastavnik = async (req, res) => {
    const { ime, prezime, username, password, adminID } = req.body;

    try {
        // Enkripcija lozinke
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upis u tabelu nastavnik (nastavnikID je Auto Increment)
        await db.query(
            'INSERT INTO nastavnik (ime, prezime, username, password, adminID) VALUES (?, ?, ?, ?, ?)',
            [ime, prezime, username, hashedPassword, adminID]
        );

        res.status(201).json({ message: "Nastavnik uspešno registrovan!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};