const db = require('../config/db');

exports.createSadrzaj = async (req, res) => {
    const { naziv, tip, maxPoena, rok, nastavnikID } = req.body;

    try {
        await db.query(
            'INSERT INTO sadrzaj (naziv, tip, maxPoena, rok, nastavnikID) VALUES (?, ?, ?, ?, ?)',
            [naziv, tip, maxPoena, rok, nastavnikID]
        );

        res.status(201).json({ message: "Sadržaj uspešno dodat!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};