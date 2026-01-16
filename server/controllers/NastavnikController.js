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
exports.deleteNastavnik = async (req, res) => {
    const { id } = req.params;

    try {
        // Pokušavamo da obrišemo samo nastavnika
        const [result] = await db.query(
            'DELETE FROM nastavnik WHERE nastavnikID = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Nastavnik nije pronađen!" });
        }

        res.status(200).json({ message: "Nastavnik je uspešno obrisan!" });
    } catch (err) {
        // Specifična provera stranog ključa (ER_ROW_IS_REFERENCED_2)
        // Ako nastavnik drži neku grupu ili je okačio sadržaj, baza će izbaciti ovaj error
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ 
                error: "Nije moguće obrisati nastavnika jer je povezan sa grupama ili sadržajima." 
            });
        }
        res.status(500).json({ error: err.message });
    }
};