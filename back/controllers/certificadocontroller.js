const certi = require("../models/certificado");
const path = require('path');
const moment = require('moment-timezone'); // Importar moment-timezone
const controller = {};

controller.agregar = async (req, res) => {
  const { certificado, proforma, documento, estado, emitido, cliente } = req.body;
  const file = req.file ? req.file.filename : null;

  // Convertir la fecha de emisión a UTC antes de guardarla en la base de datos
  const emitidoUTC = moment(emitido).utc().format();

  try {
    await certi.create({
      certificado,
      proforma,
      documento,
      estado,
      emitido: emitidoUTC, // Utilizar la fecha de emisión proporcionada
      cliente,
      file // Guardar el nombre del archivo en la base de datos
    });
    return res.send({ msg: "Se agregó correctamente", file });
  } catch (error) {
    console.error("Error al agregar el certificado:", error);
    return res.status(500).send({ msg: "Error al agregar el certificado", error: error.message });
  }
};

controller.btnertoddos = async (req, res) => {
  try {
    let datos = await certi.findAll();
    return res.send(datos);
  } catch (error) {
    return res.send({ error });
  }
};

controller.getcertificado = async (req, res) => {
  try {
    const parametro = req.params.parametro;
    console.log(parametro)
    let datos = await certi.findOne({ where: { certificado: parametro } });
    return res.send(datos);
  } catch (error) {
    return res.send({ error });
  }
};

controller.viewfile = async (req, res) => {
  try {
    console.log(req.query.name);
    let name= req.query.name;
    const filePath = path.join(__dirname, '../uploads', name);
    return res.sendFile(filePath);
  } catch (error) {
    return res.send({ error });
  }
};

module.exports = controller;
