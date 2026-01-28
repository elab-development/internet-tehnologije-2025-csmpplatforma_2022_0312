const db = require('../config/db');

exports.createSadrzaj = async (req, res) => {
    const { naziv, tip, maxPoena, rok, pitanje, nastavnikID } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO sadrzaj (naziv, tip, maxPoena, rok, pitanje, nastavnikID) VALUES (?, ?, ?, ?, ?, ?)',
            [naziv, tip, maxPoena, rok, pitanje, nastavnikID]
        );
        res.status(201).json({ 
            message: "Sadržaj uspešno dodat!", 
            sadrzajID: result.insertId 
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getSadrzaj = async (req, res) => {
    const { naziv, tip, id } = req.query; 
    try {
        let query = `
            SELECT s.*, g.grupaID as dodeljenoGrupiID, DATE_FORMAT(s.rok, '%Y-%m-%d') as rok 
            FROM sadrzaj s
            LEFT JOIN grupa g ON s.sadrzajID = g.sadrzajID
            WHERE 1=1`;
        
        let params = [];
        if (id) { query += ' AND s.sadrzajID = ?'; params.push(id); }
        if (naziv) { query += ' AND s.naziv LIKE ?'; params.push(`%${naziv}%`); }
        if (tip) { query += ' AND s.tip = ?'; params.push(tip); }

        const [rows] = await db.query(query, params);
        res.status(200).json(id ? rows[0] : rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getUnikatniTipovi = async (req, res) => {
    try {
        
        const [rows] = await db.query('SELECT DISTINCT tip FROM sadrzaj');
        const tipovi = rows.map(row => row.tip);
        res.status(200).json(tipovi);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};