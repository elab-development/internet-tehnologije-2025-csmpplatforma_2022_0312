const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.registerStudent = async (req, res) => {
    const { ime, prezime, username, password, grupaId } = req.body;

    try {
        // Enkripcija lozinke (zahtev za bezbednost)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upis u tvoju tabelu student
        await db.query(
            'INSERT INTO student (ime, prezime, username, password, grupaId) VALUES ( ?, ?, ?, ?, ?)',
            [ime, prezime, username, password, grupaId]
        );

        res.status(201).json({ message: "Student uspešno registrovan!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};