const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('../services/emailService');

exports.registerStudent = async (req, res) => {
    const { ime, prezime, email, username, password, adminID, grupaID } = req.body;

    try {    
        const hashedPassword = await bcrypt.hash(password, 10);  
        await db.query(
            'INSERT INTO student (ime, prezime, email, username, password, adminID,grupaID) VALUES ( ?, ?, ?, ?, ?, ?,?)',
            [ime, prezime, email, username, hashedPassword, adminID,grupaID]
        );
        await sendWelcomeEmail(email, ime);

        res.status(201).json({ message: "Student uspešno registrovan!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        
        const [result] = await db.query(
            'DELETE FROM student WHERE studentID = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Student nije pronađen!" });
        }

        res.status(200).json({ message: "Student je uspešno obrisan!" });
    } catch (err) {
        
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ 
                error: "Nije moguće obrisati studenta jer ima povezane projekte ili predaje." 
            });
        }
        res.status(500).json({ error: err.message });
    }
};

exports.getStudenti = async (req, res) => {
    const { search } = req.query; 
    try {
        let query = `
            SELECT s.studentID, s.ime, s.prezime, s.email, s.username, s.adminID, s.grupaID, g.naziv as nazivGrupe 
            FROM student s 
            LEFT JOIN grupa g ON s.grupaID = g.grupaID
        `;
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

exports.updateStudentGrupa = async (req, res) => {
    const { id } = req.params;
    const { grupaID } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE student SET grupaID = ? WHERE studentID = ?',
            [grupaID, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Student nije pronađen!" });
        }

        res.status(200).json({ message: "Grupa uspešno ažurirana!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};