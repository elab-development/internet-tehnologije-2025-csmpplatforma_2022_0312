const express = require('express');
const router = express.Router();
const predajaController = require('../controllers/PredajaController');

router.post('/submit', predajaController.createPredaja);

module.exports = router;