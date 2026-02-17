/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Uloguj korisnika
 *     tags:
 *       - Autentifikacija
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kod
 *             properties:
 *               kod:
 *                 type: string
 *                 example: "pera123"
 *     responses:
 *       200:
 *         description: Uspešan login
 *       401:
 *         description: Pogrešan kod
 */
const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const verifyToken = require('../middleware/auth'); 

router.post('/login',AuthController.universalLogin);
router.post('/logout', verifyToken ,AuthController.logout);

module.exports = router;