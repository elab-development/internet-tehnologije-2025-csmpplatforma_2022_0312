const db = require('../config/db');

exports.createPredaja = async (req, res) => {
    const { studentID, sadrzajID, sadrzajRada } = req.body;

    try { 
        // Sada imamo 3 kolone (studentID, sadrzajID, sadrzajRada) 
        // i tačno 3 vrednosti (?, ?, ?)
        // datumPredaje se automatski puni sa NOW()
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