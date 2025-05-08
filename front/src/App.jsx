import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import './App.css';
import getURL from './config';
import moment from 'moment-timezone';

function App() {
  const [texto, setTexto] = useState({
    certificado: "",
    proforma: "",
    documento: "",
    estado: "",
    emitido: "",    
    cliente: ""
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
      const response = await axios.post(getURL()+'/agregar', formData, {
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
      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '600px' }}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="certificado">Nro. Certificado</label>
            <input type="text" name="certificado" id="certificado" onChange={handleChange} className="form-control"/>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="proforma">Nro. Proforma</label>
            <input type="text" name="proforma" id="proforma" onChange={handleChange} className="form-control"/>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="documento">Tipo Documento</label>
          <select name="documento" id="documento" onChange={handleChange} className="form-control">
            <option value="">Seleccione una opción</option>
            <option value="CERTIFICADO">Certificado</option>
            <option value="CERTIFICADO ACREDITADO">Certificado Acreditado</option>
            <option value="INFORME TECNICO">Informe Técnico</option>
            <option value="INFORME DE VERFICACION">Informe De Verificación</option>
            <option value="INFORME DE CALIFICACION">Informe De Calificación</option>
            <option value="CALIFICACION">Calificación</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="estado">Estado</label>
          <input type="text" name="estado" id="estado" onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="emitido">Fecha de Emision:</label>
          <input type="datetime-local" name="emitido" id="emitido" onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="cliente">Cliente</label>
          <input type="text" name="cliente" id="cliente" onChange={handleChange} className="form-control"/>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="file">Seleccionar archivo</label>
          <input type="file" name="file" id="file" onChange={handleFileChange} className="form-control" accept="application/pdf" />
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
