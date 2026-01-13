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