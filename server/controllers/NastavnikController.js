const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerNastavnik = async (req, res) => {
    const { ime, prezime, username, password, adminID } = req.body;

    try {
        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        await db.query(
            'INSERT INTO nastavnik (ime, prezime, username, password, adminID) VALUES (?, ?, ?, ?, ?)',
            [ime, prezime, username, hashedPassword, adminID]
        );

        res.status(201).json({ message: "Nastavnik uspešno registrovan!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteNastavnik = async (req, res) => {
    const { id } = req.params;

    try {
        
        const [result] = await db.query(
            'DELETE FROM nastavnik WHERE nastavnikID = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Nastavnik nije pronađen!" });
        }

        res.status(200).json({ message: "Nastavnik je uspešno obrisan!" });
    } catch (err) {
        
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ 
                error: "Nije moguće obrisati nastavnika jer je povezan sa grupama ili sadržajima." 
            });
        }
        res.status(500).json({ error: err.message });
    }
};
exports.getNastavnici = async (req, res) => {
    const { search } = req.query; 

    try {
        let query = 'SELECT nastavnikID, ime, prezime, username, adminID FROM nastavnik';
        let params = [];

        if (search) {
            
            query += ' WHERE (ime LIKE ? OR prezime LIKE ? OR CONCAT(ime, " ", prezime) LIKE ?)';
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        const [rows] = await db.query(query, params);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
