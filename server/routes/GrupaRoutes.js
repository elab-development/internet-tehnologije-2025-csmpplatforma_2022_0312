const express = require('express');
const router = express.Router();
const grupaController = require('../controllers/GrupaController');
const verifyToken = require('../middleware/auth');

router.post('/create', verifyToken, grupaController.createGrupa);
router.put('/update/:id', verifyToken, grupaController.updateGrupa);
router.get('/select', verifyToken, grupaController.getGrupe);

module.exports = router;