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

function extraerDatoPorEtiqueta(texto, etiqueta, siguienteEtiqueta) {
  const regex = new RegExp(`${etiqueta}\\s*[:\\-]?\\s*(.*?)\\s*(?=${siguienteEtiqueta ? siguienteEtiqueta : '\\n'})`, 'i');
  const match = texto.match(regex);
  return match ? match[1].trim() : null;
}



function extraerCampos(texto) {
  const campos = {};
  //Nombre del certificado
  const tituloMatch = texto.match(/Certificado\s+de\s+Calibraci[oó]n/i);
  campos.nombreCertificado = tituloMatch ? tituloMatch[0].trim() : null;


  // Número de certificado
  const certMatch = texto.match(/\b([A-Z]{1,4}\d{0,2}-[A-Z]-\d{5,7})\b/);
  campos.numeroCertificado = certMatch ? certMatch[1] : null;

   // Número de proforma
  const profMatch = texto.match(/\bP-SMC-\d{3,4}-\d{4}\s*V\d\b/i);
  campos.numeroProforma = profMatch ? profMatch[0] : "P-SMC-000-2025 V0";

  // Razón social
  const razonMatch = texto.match(/Raz[oó]n Social\s*[:\-]?\s*([^\n]+)/i);
  campos.razonSocial = razonMatch ? razonMatch[1].trim() : null;

  // ✅ Dirección robusta con OCR flexible
  const direccionRegex = /dir\s*ecci[oó]n\s*[:\-]?\s*((?:.*\n?){1,2})/i;
  const direccionMatch = texto.match(direccionRegex);

  if (direccionMatch) {
    let direccionCruda = direccionMatch[1]
      .replace(/\n/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

    campos.direccion = direccionCruda;
  } else {
    campos.direccion = null;
  }

  // Fecha de calibración
  const fechaCalib = texto.match(/Fecha de Calibraci[oó]n\s*[:\-]?\s*(\d{4}-\d{2}-\d{2})/i);
  campos.fechaCalibracion = fechaCalib ? fechaCalib[1] : null;

 // Lugar de Calibración (limpio)
  const lugarRegex = /Lugar\s*de\s*Calib\s*raci[oó]n\s*[:\-]?\s*(EN\s+EL\s+LABORATORIO.*?)\s*(?:Fecha\s+de\s+Emisión|$)/i;
  const lugarMatch = texto.replace(/\r?\n/g, ' ').match(lugarRegex);

  if (lugarMatch && lugarMatch[1]) {
    campos.lugarCalibracion = lugarMatch[1].trim();
  } else {
    campos.lugarCalibracion = null;
  }

  // Fecha de emisión
  const fechaEmi = texto.match(/Fecha de Emisi[oó]n\s*[:\-]?\s*(\d{4}-\d{2}-\d{2})/i);
  campos.fechaEmision = fechaEmi ? fechaEmi[1] : null;

  // Marca, modelo, serie
  campos.marca = texto.match(/Marca\s*[:\-]?\s*(.+)/i)?.[1]?.trim() || null;
  campos.modelo = texto.match(/Modelo\s*[:\-]?\s*(.+)/i)?.[1]?.trim() || null;
  campos.serie = texto.match(/Serie\s*[:\-]?\s*(.+)/i)?.[1]?.trim() || null;

  // Procedencia
  campos.procedencia = texto.match(/Procedencia\s*[:\-]?\s*(.+)/i)?.[1]?.trim() || null;

  // Identificación
  const identificacionMatch = texto.match(/Identificaci[oó]n\s*[:\-]?\s*([A-Z0-9\-]+)/i);
  campos.identificacion = identificacionMatch ? identificacionMatch[1] : null;

  // Ubicación
  campos.ubicacion = texto.match(/Ubicaci[oó]n\s*[:\-]?\s*(.+)/i)?.[1]?.trim() || null;

  // Capacidad de indicación
  campos.capacidadIndicacion = texto.match(/Capacidad de Indicaci[oó]n\s*[:\-]?\s*(.+)/i)?.[1]?.trim() || null;

  // Resolución
  campos.resolucion = texto.match(/Resoluci[oó]n\s*\(d\)\s*[:\-]?\s*(.+)/i)?.[1]?.trim() || null;

  // División de verificación
  campos.divisionVerificacion = texto.match(/Div\.? de Verificaci[oó]n \(e\)\s*[:\-]?\s*(.+)/i)?.[1]?.trim() || null;

  //Capacidad Mínima
  const capacidadMinimaMatch = texto.match(/Cap(?:\.|\s)?\s*M[ií]nima\s*\(Min\.\)\s*[:\-]?\s*([^\n]+)/i);
  campos.capacidadMinima = capacidadMinimaMatch ? capacidadMinimaMatch[1].trim() : null;

 // Número de Divisiones
  const numeroDivisionesMatch = texto.match(/N[uú]mero\s+de\s+Divisiones\s*\(n\)\s*[:\-]?\s*([^\n]+)/i);
  campos.numeroDivisiones = numeroDivisionesMatch ? numeroDivisionesMatch[1].trim() : null;

  // Clase de Exactitud
  const claseExactitudMatch = texto.match(/Clase\s+Exactitud\s*[:\-]?\s*([^\n\.]+)/i);
  campos.claseExactitud = claseExactitudMatch ? claseExactitudMatch[1].trim() : null;

  // Método de calibración (extraer texto completo del párrafo)
  const metodoMatch = texto.match(/M[EÉ]TODO DE CALIBRACI[ÓO]N\s*[\n\r]+([\s\S]+?)\n[A-Z]/);
  campos.metodoCalibracion = metodoMatch ? metodoMatch[1].replace(/\s+/g, ' ').trim() : null;

  return campos;
}


module.exports = { analizarArchivo };
