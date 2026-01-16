const express = require('express');
const router = express.Router();
const studentController = require('../controllers/StudentController');

router.post('/register', studentController.registerStudent);
router.delete('/delete/:id', studentController.deleteStudent);
router.get('/select', studentController.getStudenti);

module.exports = router;