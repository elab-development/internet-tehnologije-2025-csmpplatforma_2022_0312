const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerStudent = async (req, res) => {
    const { ime, prezime, username, password, adminID, grupaID } = req.body;

    try {
        // Enkripcija lozinke (zahtev za bezbednost)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upis u tvoju tabelu student
        await db.query(
            'INSERT INTO student (ime, prezime, username, password, adminID,grupaID) VALUES ( ?, ?, ?, ?, ?,?)',
            [ime, prezime, username, hashedPassword, adminID,grupaID]
        );

        res.status(201).json({ message: "Student uspešno registrovan!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        // Pokušavamo da obrišemo samo studenta
        const [result] = await db.query(
            'DELETE FROM student WHERE studentID = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Student nije pronađen!" });
        }

        res.status(200).json({ message: "Student je uspešno obrisan!" });
    } catch (err) {
        // Ako student ima povezane radove, upadamo ovde
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ 
                error: "Nije moguće obrisati studenta jer ima povezane projekte ili predaje." 
            });
        }
        res.status(500).json({ error: err.message });
    }
};

exports.getStudenti = async (req, res) => {
    const { ime, prezime } = req.query; // Uzimamo parametre iz Query taba u Thunder Client-u

    try {
        let query = 'SELECT studentID, ime, prezime, username, adminID, grupaID FROM student WHERE 1=1';
        let params = [];

        if (ime) {
            query += ' AND ime LIKE ?';
            params.push(`%${ime}%`);
        }

        if (prezime) {
            query += ' AND prezime LIKE ?';
            params.push(`%${prezime}%`);
        }

        const [rows] = await db.query(query, params);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.loginStudent = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Provera da li student postoji
        const [rows] = await db.query(
            'SELECT * FROM student WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Pogrešan username" });
        }

        const student = rows[0];
        

        // Provera lozinke
        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Pogresan password!" });
        }

        const token = jwt.sign(
        { id: student.studentID, role: 'student' }, 'tajni_kljuc',  { expiresIn: '7h' } );

        // Uspešna prijava (bez tokena, jednostavno – za rad)
        res.status(200).json({
            message: "Uspešna prijava!",
            token : token,
            student: {
                studentID: student.studentID,
                ime: student.ime,
                prezime: student.prezime,
                username: student.username,
                adminID: student.adminID,
                grupaID: student.grupaID
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};