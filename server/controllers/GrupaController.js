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