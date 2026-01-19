const express = require('express');
const router = express.Router();
const nastavnikController = require('../controllers/NastavnikController');
const verifyToken = require('../middleware/auth');

router.post('/register', nastavnikController.registerNastavnik);
router.get('/select', nastavnikController.getNastavnici);

router.delete('/delete/:id', verifyToken ,nastavnikController.deleteNastavnik);

module.exports = router;