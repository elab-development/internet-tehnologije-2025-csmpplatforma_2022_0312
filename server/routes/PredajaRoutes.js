/**
 * @swagger
 * tags:
 *   name: Predaje
 *   description: Upravljanje predajama radova
 */

/**
 * @swagger
 * /api/predaja/submit:
 *   post:
 *     summary: Kreiranje nove predaje
 *     description: Student predaje svoj rad. 
 *     tags:
 *       - Predaje
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentID
 *               - sadrzajID
 *               - sadrzajRada
 *               - datumPredaje
 *             properties:
 *               studentID:
 *                 type: integer
 *                 example: 3
 *               sadrzajID:
 *                 type: integer
 *                 example: 1
 *               sadrzajRada:
 *                 type: string
 *                 example: "Matrica je..."
 *               datumPredaje:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-22"
 *               ocenaID:
 *                 type: integer
 *                 example: 2
 *                 description: Opcionalno, može biti null ako još nije ocenjena
 *     responses:
 *       201:
 *         description: Predaja uspešno kreirana
 *       400:
 *         description: Neispravni podaci
 *       500:
 *         description: Greška na serveru
 */

/**
 * @swagger
 * /api/predaja/all:
 *   get:
 *     summary: Vrati sve predaje
 *     description: Vraća kompletnu listu predaja svih studenata.
 *     tags:
 *       - Predaje
 *     responses:
 *       200:
 *         description: Lista predaja uspešno vraćena
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   predajaID:
 *                     type: integer
 *                     example: 1
 *                   studentID:
 *                     type: integer
 *                     example: 3
 *                   sadrzajID:
 *                     type: integer
 *                     example: 1
 *                   sadrzajRada:
 *                     type: string
 *                     example: "Matrica je..."
 *                   datumPredaje:
 *                     type: string
 *                     format: date
 *                     example: "2025-06-25"
 *                   ocenaID:
 *                     type: integer
 *                     example: 2
 *                 required:
 *                   - predajaID
 *                   - studentID
 *                   - sadrzajID
 *                   - sadrzajRada
 *                   - datumPredaje
 *       500:
 *         description: Greška na serveru
 */

/**
 * @swagger
 * /api/predaja/oceni/{predajaID}:
 *   put:
 *     summary: Ažuriranje ocene predaje
 *     description: Dodaje ili menja ocenu za određenu predaju.
 *     tags:
 *       - Predaje
 *     parameters:
 *       - in: path
 *         name: predajaID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID predaje koja se ocenjuje
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ocenaID
 *             properties:
 *               ocenaID:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Ocena predaje uspešno ažurirana
 *       400:
 *         description: Neispravni podaci
 *       404:
 *         description: Predaja nije pronađena
 *       500:
 *         description: Greška na serveru
 */

/**
 * @swagger
 * /api/predaja/student/{studentID}:
 *   get:
 *     summary: Vrati sve predaje određenog studenta
 *     description: Vraća listu svih predaja za datog studenta.
 *     tags:
 *       - Predaje
 *     parameters:
 *       - in: path
 *         name: studentID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID studenta
 *         example: 3
 *     responses:
 *       200:
 *         description: Lista predaja uspešno vraćena
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   predajaID:
 *                     type: integer
 *                     example: 1
 *                   studentID:
 *                     type: integer
 *                     example: 3
 *                   sadrzajID:
 *                     type: integer
 *                     example: 1
 *                   sadrzajRada:
 *                     type: string
 *                     example: "Matrica je..."
 *                   datumPredaje:
 *                     type: string
 *                     format: date
 *                     example: "2025-06-25"
 *                   ocenaID:
 *                     type: integer
 *                     example: 2
 *                 required:
 *                   - predajaID
 *                   - studentID
 *                   - sadrzajID
 *                   - sadrzajRada
 *                   - datumPredaje
 *       404:
 *         description: Student ili predaje nisu pronađene
 *       500:
 *         description: Greška na serveru
 */

const express = require('express');
const router = express.Router();
const predajaController = require('../controllers/PredajaController');

router.post('/submit', predajaController.createPredaja);
router.get('/all', predajaController.getAllPredaje);
router.put('/oceni/:predajaID', predajaController.updateOcena);
router.get('/student/:studentID', predajaController.getStudentPredaje);

module.exports = router;