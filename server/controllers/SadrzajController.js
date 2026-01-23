const db = require('../config/db');

exports.createSadrzaj = async (req, res) => {
    const { naziv, tip, maxPoena, rok, pitanje, nastavnikID } = req.body;

    try {
        await db.query(
            'INSERT INTO sadrzaj (naziv, tip, maxPoena, rok, pitanje, nastavnikID) VALUES (?, ?, ?, ?, ?, ?)',
            [naziv, tip, maxPoena, rok, pitanje, nastavnikID]
        );

        res.status(201).json({ message: "Sadržaj uspešno dodat!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSadrzaj = async (req, res) => {
    const { naziv, tip, id } = req.query; // Dodali smo id ovde

    try {
        let query = `
            SELECT sadrzajID, naziv, tip, maxPoena, 
            DATE_FORMAT(rok, '%Y-%m-%d') as rok, pitanje, 
            nastavnikID 
            FROM sadrzaj WHERE 1=1`;
        
        let params = [];

        // Ako je poslat ID, tražimo samo taj jedan red
        if (id) {
            query += ' AND sadrzajID = ?';
            params.push(id);
            const [rows] = await db.query(query, params);
            // Vraćamo samo JEDAN objekat, ne niz!
            return res.status(200).json(rows[0]);
        }
        
        if (naziv) {
            query += ' AND naziv LIKE ?';
            params.push(`%${naziv}%`);
        }

        if (tip) {
            query += ' AND tip = ?';
            params.push(tip);
        }

        const [rows] = await db.query(query, params);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};