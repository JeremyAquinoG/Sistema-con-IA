const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');

// Ruta para subir archivos
router.post('/upload', upload.single('archivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ningún archivo.' });
  }

  res.status(200).json({
    message: 'Archivo subido correctamente.',
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    path: req.file.path
  });
});

module.exports = router;
