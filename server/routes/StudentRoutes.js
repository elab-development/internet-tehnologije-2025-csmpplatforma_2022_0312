/**
 * @swagger
 * tags:
 *   name: Studenti
 *   description: Upravljanje studentima u sistemu
 */



/**
 * @swagger
 * /api/student/select:
 *   get:
 *     summary: Vrati listu svih studenata
 *     description: Vraćamo kompletnu listu studenata iz baze podataka.
 *     tags:
 *       - Studenti
 *     responses:
 *       200:
 *         description: Uspešno vraćena lista studenata
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   studentID:
 *                     type: integer
 *                     example: 1
 *                   ime:
 *                     type: string
 *                     example: "Zoran"
 *                   prezime:
 *                     type: string
 *                     example: "Stojanović"
 *                   username:
 *                     type: string
 *                     example: "zoki"
 *                   adminID:
 *                     type: integer
 *                     example: 2
 *                   grupaID:
 *                     type: integer
 *                     example: 5
 *                 required:
 *                   - studentID
 *                   - ime
 *                   - prezime
 *                   - username
 *                   - adminID
 *                   - grupaID
 *       404:
 *         description: Nema pronađenih studenata
 *       500:
 *         description: Greška na serveru prilikom čitanja baze
 */


/**
 * @swagger
 * /api/student/register:
 *   post:
 *     summary: Registracija novog studenta
 *     description: Kreira novog studenta u sistemu.
 *     tags:
 *       - Studenti
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ime
 *               - prezime
 *               - username
 *               - password
 *               - adminID
 *               - grupaID
 *             properties:
 *               ime:
 *                 type: string
 *                 example: "Petar"
 *               prezime:
 *                 type: string
 *                 example: "Petrović"
 *               username:
 *                 type: string
 *                 example: "petar123"
 *               password:
 *                 type: string
 *                 example: "lozinka123"
 *               adminID:
 *                 type: integer
 *                 example: 1
 *               grupaID:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Student uspešno registrovan
 *       400:
 *         description: Neispravni podaci
 *       500:
 *         description: Greška na serveru
 */


/**
 * @swagger
 * /api/student/select:
 *   get:
 *     summary: Vrati listu svih studenata
 *     description: Endpoint vraća kompletnu listu studenata iz baze podataka.
 *     tags:
 *       - Studenti
 *     responses:
 *       200:
 *         description: Uspešno vraćena lista studenata
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   studentID:
 *                     type: integer
 *                     example: 1
 *                   ime:
 *                     type: string
 *                     example: "Petar"
 *                   prezime:
 *                     type: string
 *                     example: "Petrović"
 *                   username:
 *                     type: string
 *                     example: "petar123"
 *                   adminID:
 *                     type: integer
 *                     example: 1
 *                   grupaID:
 *                     type: integer
 *                     example: 3
 *                 required:
 *                   - studentID
 *                   - ime
 *                   - prezime
 *                   - username
 *                   - adminID
 *                   - grupaID
 *       404:
 *         description: Nema pronađenih studenata
 *       500:
 *         description: Greška na serveru
 */


/**
 * @swagger
 * /api/student/delete/{id}:
 *   delete:
 *     summary: Brisanje studenta
 *     description: Briše studenta na osnovu ID-a. Zahteva validan JWT token.
 *     tags:
 *       - Studenti
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID studenta koji se briše
 *         example: 1
 *     responses:
 *       200:
 *         description: Student uspešno obrisan
 *       401:
 *         description: Neautorizovan pristup (nevalidan token)
 *       404:
 *         description: Student nije pronađen
 *       500:
 *         description: Greška na serveru
 */


/**
 * @swagger
 * /api/student/update-grupa/{id}:
 *   put:
 *     summary: Izmena grupe studenta
 *     description: Ažurira grupu studenta na osnovu ID-a. Zahteva validan JWT token.
 *     tags:
 *       - Studenti
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID studenta
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - grupaID
 *             properties:
 *               grupaID:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Grupa uspešno ažurirana
 *       401:
 *         description: Neautorizovan pristup
 *       404:
 *         description: Student nije pronađen
 *       500:
 *         description: Greška na serveru
 */


const express = require('express');
const router = express.Router();
const studentController = require('../controllers/StudentController');
const verifyToken = require('../middleware/auth');

router.post('/register', studentController.registerStudent);
router.get('/select', studentController.getStudenti);

router.delete('/delete/:id', verifyToken ,studentController.deleteStudent);
router.put('/update-grupa/:id', verifyToken, studentController.updateStudentGrupa);

module.exports = router;