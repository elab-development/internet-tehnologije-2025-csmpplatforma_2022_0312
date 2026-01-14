const express = require('express');
const router = express.Router();
const grupaController = require('../controllers/GrupaController');

router.post('/create', grupaController.createGrupa);

module.exports = router;