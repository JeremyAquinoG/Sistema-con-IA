import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import '../Ventanas/App.css';
import getURL from '../Config/config';
import moment from 'moment-timezone';

function App() {
  const [texto, setTexto] = useState({
    certificado: "",
    proforma: "",
    documento: "",
    estado: "",
    emitido: "",
    cliente: "",
    nombreCertificado: "",
    direccion: "",
    fechaCalibracion: "",
    lugarCalibracion: "",
    marca: "",
    modelo: "",
    serie: "",
    procedencia: "",
    identificacion: "",
    ubicacion: "",
    capacidadIndicacion: "",
    resolucion: "",
    divisionVerificacion: "",
    capacidadMinima: "",
    numeroDivisiones: "",
    claseExactitud: "",
    metodoCalibracion: ""
  });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false); // Nuevo estado para el color del botón
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Nuevo estado para el botón "Siguiente"
  const qrRef = useRef();
  const navigate = useNavigate();


  useEffect(() => {
    // Verificar si todos los campos, excepto el archivo, están llenos
    const { certificado, proforma, documento, estado, emitido, cliente } = texto;
    if (certificado && proforma && documento && estado && emitido && cliente) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  }, [texto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTexto(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Convertir la fecha de emisión a UTC antes de enviarla al servidor
    const emitidoUTC = moment(texto.emitido).utc().format();
    formData.append('certificado', texto.certificado);
    formData.append('proforma', texto.proforma);
    formData.append('documento', texto.documento);
    formData.append('estado', texto.estado);
    formData.append('emitido', emitidoUTC);
    formData.append('cliente', texto.cliente);
    formData.append('file', file);

    try {
      const response = await axios.post(getURL() + '/agregar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFileName(response.data.file);
      setShowSuccess(true);
      setButtonClicked(true); // Cambiar color del botón después del clic
      setIsFormSubmitted(true); // Habilitar el botón "Siguiente"
      console.log('Datos guardados:', response.data);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error al enviar datos:', error);
    }
  };

  const handleNavigate = () => {
    navigate(`/display/${texto.certificado}`, { state: { data: texto, fileName } });
    //navigate(`/appsmc/display/${texto.certificado}`, { state: { data: texto, fileName } });
  };

  const handleGenerateQrCode = () => {
    const qrUrl = `${window.location.origin}/appsmc/display/${texto.certificado}`;
    setQrCodeUrl(qrUrl);
  };

  const handleDownloadQrCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${texto.certificado}_QRCode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleAnalizarArchivo = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("archivo", file);

    try {
      const response = await axios.post(getURL() + "/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const { camposExtraidos } = response.data;

      setTexto(prev => ({
        ...prev,
        certificado: camposExtraidos.numeroCertificado || prev.certificado,
        proforma: camposExtraidos.numeroProforma || prev.proforma,
        cliente: camposExtraidos.razonSocial || prev.cliente,
        estado: camposExtraidos.estado || "Firmado",
        emitido: camposExtraidos.fechaEmision || prev.emitido,

        // Nuevos campos agregados
        nombreCertificado: camposExtraidos.nombreCertificado || prev.nombreCertificado,
        direccion: camposExtraidos.direccion || prev.direccion,
        fechaCalibracion: camposExtraidos.fechaCalibracion || prev.fechaCalibracion,
        lugarCalibracion: camposExtraidos.lugarCalibracion || prev.lugarCalibracion,
        marca: camposExtraidos.marca || prev.marca,
        modelo: camposExtraidos.modelo || prev.modelo,
        serie: camposExtraidos.serie || prev.serie,
        procedencia: camposExtraidos.procedencia || prev.procedencia,
        identificacion: camposExtraidos.identificacion || prev.identificacion,
        ubicacion: camposExtraidos.ubicacion || prev.ubicacion,
        capacidadIndicacion: camposExtraidos.capacidadIndicacion || prev.capacidadIndicacion,
        resolucion: camposExtraidos.resolucion || prev.resolucion,
        divisionVerificacion: camposExtraidos.divisionVerificacion || prev.divisionVerificacion,
        capacidadMinima: camposExtraidos.capacidadMinima || prev.capacidadMinima,
        numeroDivisiones: camposExtraidos.numeroDivisiones || prev.numeroDivisiones,
        claseExactitud: camposExtraidos.claseExactitud || prev.claseExactitud,
       metodoCalibracion: camposExtraidos.metodoCalibracion
  ? camposExtraidos.metodoCalibracion.replace(/\\["\\]/g, '').replace(/\s{2,}/g, ' ').trim()
  : prev.metodoCalibracion,

      }));
    } catch (error) {
      console.error("Error al analizar archivo:", error);
      alert("No se pudo analizar el archivo. Verifica que sea legible.");
    }
  };



  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <img src={"https://smc-peru.com/appsmc/logo-smc.png"} alt="Logo de la Empresa" className="logo mb-3" />
      </div>
      <h1 className="text-center mb-4">Ingresar Datos</h1>
      {showSuccess && (
        <div className="alert alert-success" role="alert">
          Los datos han sido guardados con éxito.
        </div>
      )}

      <form className="formulario-expandido" onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="certificado">Nro. Certificado</label>
            <input type="text" name="certificado" id="certificado" value={texto.certificado} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="proforma">Nro. Proforma</label>
            <input type="text" name="proforma" id="proforma" value={texto.proforma} onChange={handleChange} className="form-control" />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="nombreCertificado" className="form-label">Nombre del Certificado</label>
          <input type="text" name="nombreCertificado" className="form-control" onChange={handleChange} value={texto.nombreCertificado} />
        </div>
        <div className="mb-3">
          <label htmlFor="emitido" className="form-label">Fecha de Emisión</label>
              <input type="date" name="emitido" className="form-control" onChange={handleChange} value={texto.emitido} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="cliente">Cliente</label>
          <input type="text" name="cliente" id="cliente" value={texto.cliente} onChange={handleChange} className="form-control" />
          {/* DATOS GENERALES DEL CERTIFICADO */}
          <div className="row mb-3">
            <div className="mb-3">
              <label htmlFor="direccion" className="form-label">Dirección</label>
              <input type="text" name="direccion" className="form-control" onChange={handleChange} value={texto.direccion} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="fechaCalibracion" className="form-label">Fecha de Calibración</label>
              <input type="date" name="fechaCalibracion" className="form-control" onChange={handleChange} value={texto.fechaCalibracion} />
            </div>
            <div className="col-md-6">
              <label htmlFor="lugarCalibracion" className="form-label">Lugar de Calibración</label>
              <input type="text" name="lugarCalibracion" className="form-control" onChange={handleChange} value={texto.lugarCalibracion} />
            </div>
          </div>

          {/* DATOS DEL EQUIPO */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label htmlFor="marca" className="form-label">Marca</label>
              <input type="text" name="marca" className="form-control" onChange={handleChange} value={texto.marca} />
            </div>
            <div className="col-md-4">
              <label htmlFor="modelo" className="form-label">Modelo</label>
              <input type="text" name="modelo" className="form-control" onChange={handleChange} value={texto.modelo} />
            </div>
            <div className="col-md-4">
              <label htmlFor="serie" className="form-label">Serie</label>
              <input type="text" name="serie" className="form-control" onChange={handleChange} value={texto.serie} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <label htmlFor="procedencia" className="form-label">Procedencia</label>
              <input type="text" name="procedencia" className="form-control" onChange={handleChange} value={texto.procedencia} />
            </div>
            <div className="col-md-4">
              <label htmlFor="identificacion" className="form-label">Identificación</label>
              <input type="text" name="identificacion" className="form-control" onChange={handleChange} value={texto.identificacion} />
            </div>
            <div className="col-md-4">
              <label htmlFor="ubicacion" className="form-label">Ubicación</label>
              <input type="text" name="ubicacion" className="form-control" onChange={handleChange} value={texto.ubicacion} />
            </div>
          </div>

          {/* DATOS TÉCNICOS */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label htmlFor="capacidadIndicacion" className="form-label">Capacidad de Indicación</label>
              <input type="text" name="capacidadIndicacion" className="form-control" onChange={handleChange} value={texto.capacidadIndicacion} />
            </div>
            <div className="col-md-4">
              <label htmlFor="resolucion" className="form-label">Resolución</label>
              <input type="text" name="resolucion" className="form-control" onChange={handleChange} value={texto.resolucion} />
            </div>
            <div className="col-md-4">
              <label htmlFor="divisionVerificacion" className="form-label">División de Verificación</label>
              <input type="text" name="divisionVerificacion" className="form-control" onChange={handleChange} value={texto.divisionVerificacion} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <label htmlFor="capacidadMinima" className="form-label">Capacidad Mínima</label>
              <input type="text" name="capacidadMinima" className="form-control" onChange={handleChange} value={texto.capacidadMinima} />
            </div>
            <div className="col-md-4">
              <label htmlFor="numeroDivisiones" className="form-label">N° de Divisiones</label>
              <input type="text" name="numeroDivisiones" className="form-control" onChange={handleChange} value={texto.numeroDivisiones} />
            </div>
            <div className="col-md-4">
              <label htmlFor="claseExactitud" className="form-label">Clase de Exactitud</label>
              <input type="text" name="claseExactitud" className="form-control" onChange={handleChange} value={texto.claseExactitud} />
            </div>
          </div>

          {/* MÉTODO DE CALIBRACIÓN */}
          <div className="mb-3">
            <label htmlFor="metodoCalibracion" className="form-label">Método</label>
            <textarea name="metodoCalibracion" rows="3" className="form-control" onChange={handleChange} value={texto.metodoCalibracion}></textarea>
          </div>

        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="file">Seleccionar archivo</label>
          <input type="file" name="file" id="file" onChange={handleFileChange} className="form-control" accept="application/pdf, image/png, image/jpeg" />
          <button type="button" className="btn btn-warning mt-2" onClick={handleAnalizarArchivo} disabled={!file}>
            Leer archivo con IA
          </button>
        </div>
        <div className="text-center">
          <button type="submit" className={`btn ${buttonClicked ? 'btn-success' : 'btn-primary'} mr-2 mb-2`} disabled={!isFormComplete}>Agregar</button><br></br>
          <button type="button" onClick={handleNavigate} className="btn btn-primary mr-2 mb-2" disabled={!isFormSubmitted}>Siguiente</button><br></br>
          <button type="button" onClick={handleGenerateQrCode} className="btn btn-secondary mb-2" disabled={!isFormComplete}>Generar Código QR</button>
        </div>
      </form>

      {qrCodeUrl && (
        <div className="text-center mt-3">
          <div ref={qrRef}>
            <QRCodeCanvas value={qrCodeUrl} size={1024} style={{ width: '256px', height: '256px' }} />
          </div>
          <p>Copia el código QR y pégalo en el documento correspondiente</p>
          <button type="button" className="btn btn-secondary" onClick={handleDownloadQrCode}>Descargar Código QR</button>
        </div>
      )}
    </div>
  );
}

export default App;
