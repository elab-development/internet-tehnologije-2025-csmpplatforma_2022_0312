/**
 * @swagger
 * tags:
 *   name: Ocene
 *   description: Upravljanje ocenama u sistemu
 */

/**
 * @swagger
 * /api/ocena:
 *   post:
 *     summary: Kreiranje nove ocene
 *     description: Dodaje novu ocenu u sistem.
 *     tags:
 *       - Ocene
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vrednost
 *             properties:
 *               vrednost:
 *                 type: integer
 *                 minimum: 5
 *                 maximum: 10
 *                 example: 9
 *               komentar:
 *                 type: string
 *                 example: "Odličan rad, uz manje sugestije za poboljšanje."
 *     responses:
 *       201:
 *         description: Ocena uspešno kreirana
 *       400:
 *         description: Neispravni podaci
 *       500:
 *         description: Greška na serveru
 */

/**
 * @swagger
 * /api/ocena/select:
 *   get:
 *     summary: Vrati listu svih ocena
 *     description: Vraća kompletnu listu ocena iz baze podataka.
 *     tags:
 *       - Ocene
 *     responses:
 *       200:
 *         description: Lista ocena uspešno vraćena
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ocenaID:
 *                     type: integer
 *                     example: 1
 *                   vrednost:
 *                     type: integer
 *                     minimum: 5
 *                     maximum: 10
 *                     example: 8
 *                   komentar:
 *                     type: string
 *                     example: "Dobar projekat."
 *                 required:
 *                   - ocenaID
 *                   - vrednost
 *       500:
 *         description: Greška na serveru
 */
const express = require('express');
const router = express.Router();
const ocenaController = require('../controllers/OcenaController');

router.post('/', ocenaController.createOcena);
router.get('/select', ocenaController.getOcene);

module.exports = router;