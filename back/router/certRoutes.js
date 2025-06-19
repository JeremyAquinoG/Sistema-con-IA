const express = require('express');
const controller = require('../controllers/certificadocontroller');
const multer = require('multer');
const path = require('path');

const Router = express.Router();

// Configurar multer para almacenar archivos en una carpeta llamada 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

// Rutas existentes
Router.post("/agregar", upload.single('file'), controller.agregar);
Router.get("/getall", controller.btnertoddos);
Router.get("/getfile", controller.viewfile);
Router.get("/certificado/:parametro", controller.getcertificado);

//Nueva ruta para guardar datos extraídos por OCR
Router.post("/guardar-extraidos", upload.single('file'), controller.guardarExtraidos);

module.exports = Router;
