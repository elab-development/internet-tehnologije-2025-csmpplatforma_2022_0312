const db = require('../config/db');

exports.createGrupa = async (req, res) => {
    const { naziv, godina, nastavnikID, sadrzajID } = req.body;

    try {
        await db.query(
            'INSERT INTO grupa (naziv, godina, nastavnikID, sadrzajID) VALUES (?, ?, ?, ?)',
            [naziv, godina, nastavnikID, sadrzajID]
        );

        res.status(201).json({ message: "Grupa uspešno kreirana!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateGrupa = async (req, res) => {
    const { id } = req.params;
    const updates = req.body; // Uzimamo sve što je poslato

    // Dinamički pravimo SQL upit
    const keys = Object.keys(updates);
    if (keys.length === 0) {
        return res.status(400).json({ message: "Nema podataka za izmenu" });
    }

    const setQuery = keys.map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);

    try {
        const [result] = await db.query(
            `UPDATE grupa SET ${setQuery} WHERE grupaID = ?`,
            [...values, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Grupa nije pronađena!" });
        }

        res.status(200).json({ message: "Grupa uspešno izmenjena!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.getGrupe = async (req, res) => {
    const { naziv, godina } = req.query; // Parametri iz Thunder Client Query taba

    try {
        let query = 'SELECT * FROM grupa WHERE 1=1';
        let params = [];

        // Filtriranje po nazivu (koristimo LIKE za delimičnu pretragu)
        if (naziv) {
            query += ' AND naziv LIKE ?';
            params.push(`%${naziv}%`);
        }

        // Filtriranje po godini (precizno podudaranje)
        if (godina) {
            query += ' AND godina = ?';
            params.push(godina);
        }

        const [rows] = await db.query(query, params);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};