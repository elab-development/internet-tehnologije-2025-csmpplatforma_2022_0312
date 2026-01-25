const express = require('express');
const router = express.Router();
const predajaController = require('../controllers/PredajaController');

router.post('/submit', predajaController.createPredaja);
router.get('/all', predajaController.getAllPredaje);
router.put('/oceni/:predajaID', predajaController.updateOcena);
router.get('/student/:studentID', predajaController.getStudentPredaje);

module.exports = router;