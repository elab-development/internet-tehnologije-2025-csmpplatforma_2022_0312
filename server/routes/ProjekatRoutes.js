const express = require('express');
const router = express.Router();
const projekatController = require('../controllers/ProjekatController');

router.post('/add', projekatController.createProjekat);
router.delete('/delete/:id', projekatController.deleteProjekat);
router.put('/update/:id', projekatController.updateProjekat);

module.exports = router;