const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { analizarArchivo } = require('../controllers/ocrController');

router.post('/upload', upload.single('archivo'), analizarArchivo);

module.exports = router;

