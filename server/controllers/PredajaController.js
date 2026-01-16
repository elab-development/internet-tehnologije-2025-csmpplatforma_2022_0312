const db = require('../config/db');

exports.createPredaja = async (req, res) => {
    // ocenaID može biti null ako rad još nije pregledan
    const { studentID, sadrzajID, ocenaID } = req.body;

    try {
        await db.query(
            'INSERT INTO predaja (studentID, sadrzajID, datumPredaje, ocenaID) VALUES (?, ?, NOW(), ?)',
            [studentID, sadrzajID, ocenaID === null ? null:ocenaID]
        );

        res.status(201).json({ message: "Predaja uspešno zabeležena!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};