import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../Ventanas/App.css';
import getURL from '../Config/config';
import moment from 'moment-timezone';
import { BsStars } from 'react-icons/bs';
import Swal from 'sweetalert2';

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false); // Nuevo estado para el color del botón
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Nuevo estado para el botón "Siguiente"
  const qrRef = useRef();
  const navigate = useNavigate();
  const [modalInfo, setModalInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    // Verificar si todos los campos, excepto el archivo, están llenos
    const { certificado, proforma,  estado, emitido, cliente } = texto;
    if (certificado && proforma &&  estado && emitido && cliente) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
    obtenerDocumentos();
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

  const emitidoUTC = moment(texto.emitido).utc().format();
  formData.append('nombreCertificado', texto.nombreCertificado);
formData.append('numeroCertificado', texto.certificado);
formData.append('numeroProforma', texto.proforma);
formData.append('razonSocial', texto.cliente); // o texto.razonSocial si ya lo tienes así
formData.append('direccion', texto.direccion);
formData.append('fechaCalibracion', texto.fechaCalibracion);
formData.append('lugarCalibracion', texto.lugarCalibracion);
formData.append('fechaEmision', texto.emitido); // asegúrate del formato
formData.append('marca', texto.marca);
formData.append('modelo', texto.modelo);
formData.append('serie', texto.serie);
formData.append('procedencia', texto.procedencia);
formData.append('identificacion', texto.identificacion);
formData.append('ubicacion', texto.ubicacion);
formData.append('capacidadIndicacion', texto.capacidadIndicacion);
formData.append('resolucion', texto.resolucion);
formData.append('divisionVerificacion', texto.divisionVerificacion);
formData.append('capacidadMinima', texto.capacidadMinima);
formData.append('numeroDivisiones', texto.numeroDivisiones);
formData.append('claseExactitud', texto.claseExactitud);
formData.append('metodoCalibracion', texto.metodoCalibracion);
formData.append('file', file);


  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(getURL() + '/guardar-extraidos', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    setFileName(response.data.file);
    setButtonClicked(true);
    setIsFormSubmitted(true);
    obtenerDocumentos();

    // ✅ Mostrar alerta de éxito con SweetAlert
    Swal.fire({
      icon: 'success',
      title: '¡Datos guardados correctamente!',
      text: 'El certificado ha sido registrado con éxito.',
      confirmButtonColor: '#007bff'
    });

    // Limpiar campos después de guardar exitosamente
setTexto({
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



  } catch (error) {
    console.error('Error al enviar datos:', error);

    // ❌ Mostrar alerta de error con SweetAlert
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar',
      text: 'Hubo un problema al intentar guardar el certificado.',
      confirmButtonColor: '#dc3545'
    });
  }
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
      const { mensaje, tiempo_ms, cantidad_palabras } = response.data;

      setModalInfo({
        mensaje,
        tiempo_ms,
        cantidad_palabras,
        nombreArchivo: file.name
      });
      setShowModal(true);


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


const obtenerDocumentos = async () => {
  try {
    const res = await axios.get(getURL() + '/getall');
    setDocumentos(res.data);
  } catch (error) {
    console.error("Error al obtener documentos:", error);
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
          <button
            type="button"
            className="neumorphic-ai-button"
            onClick={handleAnalizarArchivo}
            disabled={!file}
          >
            <BsStars className="icon-ia" />
            <span className="gradient-text">Completar con IA</span>
          </button>

        </div>
        <div className="text-center">
          <button type="submit" className={`btn ${buttonClicked ? 'btn-success' : 'btn-primary'} mr-2 mb-2`} disabled={!isFormComplete}>Agregar</button><br></br>

        </div>
      </form>

      {showModal && modalInfo && (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
      <h5 className="modal-title">✅ Análisis Completado</h5>
      <div className="modal-grid">
        <div className="modal-card modal-blue">
          <span className="icon">📄</span>
          <div>
            <div className="title">Archivo:</div>
            <div className="value">{modalInfo.nombreArchivo}</div>
          </div>
        </div>
        <div className="modal-card modal-yellow">
          <span className="icon">⏱️</span>
          <div>
            <div className="title">Tiempo de procesamiento:</div>
            <div className="value">{modalInfo.tiempo_ms} ms</div>
          </div>
        </div>
        <div className="modal-card modal-green">
          <span className="icon">📢</span>
          <div>
            <div className="title">Mensaje:</div>
            <div className="value">{modalInfo.mensaje}</div>
          </div>
        </div>
        <div className="modal-card modal-cyan">
          <span className="icon">📝</span>
          <div>
            <div className="title">Palabras detectadas:</div>
            <div className="value">{modalInfo.cantidad_palabras}</div>
          </div>
        </div>
      </div>
      <button className="btn btn-primary modal-btn" onClick={() => setShowModal(false)}>
        Cerrar
      </button>
    </div>
  </div>
)}


    </div>
  );
}

export default App;
