import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from "axios";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import moment from 'moment-timezone';
import './App.css';
import getURL from './config';

function DisplayData() {
  const [estadoUser, setEstadoUser] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const location = useLocation();
  const { nroCertificado } = useParams();
  const data = location.state ? location.state.data : null;
  const fileName = location.state ? location.state.fileName : null;

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (data) {
      console.log('Data from state:', data); // Debug
      setEstadoUser([data]);
      if (fileName) {
        const constructedFileUrl = getURL() + `/getfile?name=${fileName}`;
        setFileUrl(constructedFileUrl);
        console.log('File URL:', constructedFileUrl); // Debug
      }
    } else {
      const obtenerDatos = async () => {
        try {
          let datos = await axios.get(getURL() + `/certificado/${nroCertificado}`);
          if (datos.data) {
            console.log('Data from API:', datos.data); // Debug
            setEstadoUser([datos.data]);
            if (datos.data.file) {
              const constructedFileUrl = getURL() + `/getfile?name=${datos.data.file}`;
              setFileUrl(constructedFileUrl);
              console.log('File URL:', constructedFileUrl); // Debug
            }
          }
        } catch (error) {
          console.error('Error al obtener datos:', error);
        }
      };
      obtenerDatos();
    }
  }, [data, fileName, nroCertificado]);

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <img src={"https://smc-peru.com/appsmc/logo-smc.png"} alt="Logo de la Empresa" className="logo" />
      </div>
      <h1 className="text-center">Detalles Del Registro</h1><br></br>
      <div className="row">
        <div className="col-md-5" id="details"> <br></br>
          {estadoUser.length > 0 ? estadoUser.map((item, index) => (
            <div key={index} className="card mb-3">
              <div className="card-body">
                <p className="card-text"><strong className="text-primary">Nro. Certificado:</strong> <span className="text-light-blue">{item.certificado}</span></p>
                <p className="card-text"><strong className="text-primary">Nro. Proforma:</strong> <span className="text-light-blue">{item.proforma}</span></p>
                <p className="card-text"><strong className="text-primary">Tipo de Documento:</strong> <span className="text-light-blue">{item.documento}</span></p>
                <p className="card-text"><strong className="text-primary">Estado:</strong> <span className="text-light-blue">{item.estado}</span></p>
                <p className="card-text"><strong className="text-primary">Emitido el:</strong> <span className="text-light-blue">{moment(item.emitido).tz('America/Lima').format('YYYY-MM-DD HH:mm:ss')}</span></p>
                <p className="card-text"><strong className="text-primary">Cliente:</strong> <span className="text-light-blue">{item.cliente}</span></p>
              </div>
            </div>
          )) : <h1 className="text-center">Cargando datos...</h1>}
        </div>
       
        <div className="col-md-7" id="pdf-preview">
          {fileUrl && (
            <div>
              <h2 className="text-center"></h2>
              <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js`}>
                <div className="pdf-container">
                  <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
                </div>
              </Worker>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DisplayData;
