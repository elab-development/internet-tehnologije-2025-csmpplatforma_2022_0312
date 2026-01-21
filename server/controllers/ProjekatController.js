const db = require('../config/db');

exports.createProjekat = async (req, res) => {
    const { naziv, opis, studentID } = req.body;

    try {
        
        await db.query(
            'INSERT INTO projekat (naziv, opis, studentID) VALUES (?, ?, ?)',
            [naziv, opis, studentID]
        );

        res.status(201).json({ message: "Projekat uspešno kreiran!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteProjekat = async (req, res) => {
    const { id } = req.params; 

    try {
        const [result] = await db.query(
            'DELETE FROM projekat WHERE projekatID = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Projekat nije pronađen!" });
        }

        res.status(200).json({ message: "Projekat uspešno obrisan!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateProjekat = async (req, res) => {
    const { id } = req.params;
    const updates = req.body; 

    
    const keys = Object.keys(updates);
    
    
    if (keys.length === 0) {
        return res.status(400).json({ message: "Nema podataka za izmenu" });
    }

    
    const setQuery = keys.map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);

    try {
        const [result] = await db.query(
            `UPDATE projekat SET ${setQuery} WHERE projekatID = ?`,
            [...values, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Projekat nije pronađen!" });
        }

        res.status(200).json({ message: "Projekat uspešno izmenjen!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getProjekti = async (req, res) => {
    
    const studentID = req.params.id || req.query.studentID;
    console.log("Backend primio ID:", studentID); 

    try {
        let query;
        let params = [];

        if (studentID) {
            
            query = 'SELECT * FROM projekat WHERE studentID = ?';
            params = [studentID];
        } else {
            
            query = `
                SELECT p.*, s.ime, s.prezime 
                FROM projekat p 
                JOIN student s ON p.studentID = s.studentID
            `;
        }

        const [results] = await db.query(query, params);
        console.log("Rezultat iz baze:", results); 
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};