const db = require('../config/db');

exports.createProjekat = async (req, res) => {
    const { naziv, opis, studentID } = req.body;

    try {
        // Upis u tabelu projekat
        await db.query(
            'INSERT INTO projekat (naziv, opis, studentID) VALUES (?, ?, ?)',
            [naziv, opis, studentID]
        );

        res.status(201).json({ message: "Projekat uspešno kreiran!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteProjekat = async (req, res) => {
    const { id } = req.params; // Uzimamo ID iz URL-a (npr. /api/projekat/5)

    try {
        const [result] = await db.query(
            'DELETE FROM projekat WHERE projekatID = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Projekat nije pronađen!" });
        }

        res.status(200).json({ message: "Projekat uspešno obrisan!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateProjekat = async (req, res) => {
    const { id } = req.params;
    const updates = req.body; // npr. { "naziv": "Novi Naslov" }

    // Izvlačimo ključeve iz body-ja (npr. ["naziv"])
    const keys = Object.keys(updates);
    
    // Ako je body prazan, ne radimo ništa
    if (keys.length === 0) {
        return res.status(400).json({ message: "Nema podataka za izmenu" });
    }

    // Pravimo SQL deo: "naziv = ?, opis = ?"
    const setQuery = keys.map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);

    try {
        const [result] = await db.query(
            `UPDATE projekat SET ${setQuery} WHERE projekatID = ?`,
            [...values, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Projekat nije pronađen!" });
        }

        res.status(200).json({ message: "Projekat uspešno izmenjen!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};