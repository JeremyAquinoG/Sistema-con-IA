import React, { useEffect, useState } from "react";
import axios from "axios";
import getURL from "../Config/config";
import './Historial.css';

function Historial() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(getURL() + "/logs", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(response.data.logs);
      } catch (error) {
        console.error("Error al obtener historial:", error);
      }
    };

    fetchLogs();
  }, []);

  return (
  <div className="contenedor-historial">
<div className="encabezado-historial">
    <h2 className="titulo-historial">Historial de Actividades</h2>
  </div>
  <div className="cuerpo-historial">
    <table className="tabla-estilo">
      <thead>
        <tr>
          <th>Fecha y Hora</th>
          <th>Acción</th>
          <th>Detalle</th>
        </tr>
      </thead>
      <tbody>
        {logs.length === 0 ? (
          <tr>
            <td colSpan="3" className="acciones">No hay registros.</td>
          </tr>
        ) : (
          logs.map((log, index) => (
            <tr key={index}>
              <td>{new Date(log.fecha_hora).toLocaleString()}</td>
              <td>{log.accion}</td>
              <td>{log.detalle}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>



  );
}

export default Historial;
