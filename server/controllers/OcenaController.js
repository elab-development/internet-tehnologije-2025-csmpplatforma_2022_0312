const db = require('../config/db');

exports.createOcena = async (req, res) => {
    const {vrednost, komentar } = req.body;
    try {
        await db.query(
            'INSERT INTO ocena (vrednost, komentar) VALUES (?, ?)',
            [vrednost, komentar]
        );
        res.status(201).json({ message: "Ocena uspešno kreirana!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getOcene = async (req, res) => {
    const { vrednost, komentar } = req.query; 

    try {
        let query = `
            SELECT ocenaID, vrednost, komentar
            FROM ocena
            WHERE 1=1
        `;
        let params = [];

        if (vrednost) {
            query += ' AND vrednost = ?';
            params.push(vrednost);
        }

        

        const [rows] = await db.query(query, params);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};