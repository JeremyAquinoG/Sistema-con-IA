const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

const analizarArchivo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ningún archivo.' });
  }

  const filePath = path.resolve(__dirname, '..', req.file.path);
  const ext = path.extname(filePath).toLowerCase();

  try {
    let textoExtraido = '';

    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);

      if (pdfData.text.trim().length > 0) {
        textoExtraido = pdfData.text;
      } else {
        // PDF sin texto digital (probablemente escaneado), usar Tesseract
        textoExtraido = await extraerConTesseract(filePath);
      }

    } else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      textoExtraido = await extraerConTesseract(filePath);
    } else {
      return res.status(400).json({ message: 'Tipo de archivo no soportado.' });
    }

    res.status(200).json({ textoExtraido });

  } catch (error) {
    console.error('Error al analizar archivo:', error);
    res.status(500).json({ message: 'Error al procesar el archivo.' });
  }
};

// Función auxiliar para usar Tesseract
async function extraerConTesseract(filePath) {
  const resultado = await Tesseract.recognize(filePath, 'eng', {
    logger: m => console.log(m) // Opcional: ver progreso
  });
  return resultado.data.text;
}

module.exports = { analizarArchivo };
