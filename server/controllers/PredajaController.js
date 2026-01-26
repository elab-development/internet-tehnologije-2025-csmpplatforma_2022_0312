const db = require('../config/db');

exports.createPredaja = async (req, res) => {
    const { studentID, sadrzajID, sadrzajRada } = req.body;

    try { 
        const query = `
            INSERT INTO predaja (studentID, sadrzajID, sadrzajRada, datumPredaje) 
            VALUES (?, ?, ?, NOW())`;

        const [result] = await db.query(query, [studentID, sadrzajID, sadrzajRada]);

        res.status(201).json({ 
            message: "Predaja uspešno zabeležena!",
            predajaID: result.insertId 
        });
    } catch (err) {
        console.error("Greška na backendu pri predaji:", err);
        res.status(500).json({ error: err.message });
    }
};


exports.getAllPredaje = async (req, res) => {
    try {
        const query = `
    SELECT  
        p.predajaID, 
        p.sadrzajRada, 
        p.datumPredaje, 
        p.ocenaID,
        o.vrednost, -- Ovde je vrednost iz tabele ocena
        s.ime AS imeStudenta,
        s.prezime AS prezimeStudenta, 
        sd.naziv AS vrstaTesta
    FROM predaja p
    JOIN student s ON p.studentID = s.studentID
    JOIN sadrzaj sd ON p.sadrzajID = sd.sadrzajID
    LEFT JOIN ocena o ON p.ocenaID = o.ocenaID  -- Koristi LEFT JOIN da vidiš i neocenjene
    ORDER BY p.datumPredaje DESC`;
    
    const [rows] = await db.query(query);
    res.status(200).json(rows);
    } catch (err) {
        console.error("Greška pri dobavljanju svih predaja:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateOcena = async (req, res) => {
    const { predajaID } = req.params;
    const { ocenaID } = req.body;

    try {
        await db.query('UPDATE predaja SET ocenaID = ? WHERE predajaID = ?', [ocenaID, predajaID]);
        res.status(200).json({ message: "Ocena ažurirana!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getStudentPredaje = async (req, res) => {
    const { studentID } = req.params;
    try {
        const query = `
            SELECT 
                p.predajaID, p.sadrzajRada, p.datumPredaje,
                sd.naziv AS vrstaTesta,
                o.vrednost AS ocenaVrednost,
                o.komentar AS ocenaKomentar
            FROM predaja p
            JOIN sadrzaj sd ON p.sadrzajID = sd.sadrzajID
            LEFT JOIN ocena o ON p.ocenaID = o.ocenaID
            WHERE p.studentID = ?
            ORDER BY p.datumPredaje DESC`;

        const [rows] = await db.query(query, [studentID]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};