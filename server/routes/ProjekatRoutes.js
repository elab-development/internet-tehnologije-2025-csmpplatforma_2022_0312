const express = require('express');
const router = express.Router();
const projekatController = require('../controllers/ProjekatController');
const verifyToken = require('../middleware/auth'); 


router.post('/add', verifyToken, projekatController.createProjekat);
router.put('/update/:id', verifyToken, projekatController.updateProjekat);
router.delete('/delete/:id', verifyToken, projekatController.deleteProjekat);


router.get('/', verifyToken, projekatController.getProjekti); 
router.get('/:id', verifyToken, projekatController.getProjekti); 


module.exports = router;

