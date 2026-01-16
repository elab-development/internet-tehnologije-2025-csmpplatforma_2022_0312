const express = require('express');
const router = express.Router();
const grupaController = require('../controllers/GrupaController');

router.post('/create', grupaController.createGrupa);
router.put('/update/:id', grupaController.updateGrupa);
router.get('/select', grupaController.getGrupe);

module.exports = router;