const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
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
        textoExtraido = await extraerConTesseract(filePath);
      }

    } else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      textoExtraido = await extraerConTesseract(filePath);

      // 🔍 Añadir texto extra de recorte donde va el número de certificado
      const certificadoExtra = await extraerCertificadoSolo(filePath);
      textoExtraido += '\n' + certificadoExtra;
    } else {
      return res.status(400).json({ message: 'Tipo de archivo no soportado.' });
    }

    const camposExtraidos = extraerCampos(textoExtraido);

    res.status(200).json({
      textoExtraido,
      camposExtraidos
    });

  } catch (error) {
    console.error('Error al analizar archivo:', error);
    res.status(500).json({ message: 'Error al procesar el archivo.' });
  }
};

// 🧠 OCR general para toda la imagen
async function extraerConTesseract(filePath) {
  const resultado = await Tesseract.recognize(filePath, 'eng', {
    logger: m => console.log(m),
    tessedit_pageseg_mode: 6
  });
  return resultado.data.text;
}

// 📷 OCR específico solo en la zona del número de certificado
async function extraerCertificadoSolo(filePath) {
  const tempPath = filePath.replace(/\.(jpg|jpeg|png|pdf)$/, '_recorte.png');

  await sharp(filePath)
    .extract({ top: 150, left: 250, width: 500, height: 100 }) // ← ajusta según sea necesario
    .toFile(tempPath);

  const resultado = await Tesseract.recognize(tempPath, 'eng', {
    logger: m => console.log(m),
    tessedit_pageseg_mode: 6
  });

  fs.unlink(tempPath, () => {}); // borrar imagen recortada

  return resultado.data.text;
}

// 🔎 Extraer campos clave
function extraerCampos(texto) {
  const campos = {};

  // Número de certificado (acepta más formatos con OCR parcial)
  const certMatch = texto.match(/\b([A-Z]{1,4}\d{0,2}-[A-Z]-\d{5,7})\b/);
  campos.numeroCertificado = certMatch ? certMatch[1] : null;

  // Corrección si empieza en M24 (ejemplo típico cuando falta L)
  if (campos.numeroCertificado && campos.numeroCertificado.startsWith('M24')) {
    campos.numeroCertificado = 'L' + campos.numeroCertificado;
  }

  // Número de proforma
  const profMatch = texto.match(/\bP-SMC-\d{3,4}-\d{4}\s*V\d\b/i);
  campos.numeroProforma = profMatch ? profMatch[0] : "P-SMC-000-2025 V0";

  // Razón Social
  const razonSocialMatch = texto.match(/Raz[oóeé]n Social\s*[:\-]?\s*([A-ZÑ&.\s]+)/i);
  if (razonSocialMatch) {
    const linea = razonSocialMatch[1].trim();
    const partes = linea.split(/Dirección|Direccion|\n|AV\.|Av\.|Av |[0-9]/);
    campos.razonSocial = partes[0].trim();
  } else {
    campos.razonSocial = null;
  }

  return campos;
}

module.exports = { analizarArchivo };
