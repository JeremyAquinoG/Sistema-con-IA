import React, { useEffect, useState } from "react";
import axios from "axios";
import getURL from "../Config/config";

function DocumentList() {
  const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(getURL() + "/documentos");
        setDocumentos(response.data);
      } catch (error) {
        console.error("Error al obtener documentos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Lista de Documentos Registrados</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-primary">
            <tr>
              <th>Certificado</th>
              <th>Proforma</th>
              <th>Tipo Documento</th>
              <th>Estado</th>
              <th>Emitido</th>
              <th>Cliente</th>
            </tr>
          </thead>
          <tbody>
            {documentos.map((doc, index) => (
              <tr key={index}>
                <td>{doc.certificado}</td>
                <td>{doc.proforma}</td>
                <td>{doc.documento}</td>
                <td>{doc.estado}</td>
                <td>{new Date(doc.emitido).toLocaleString()}</td>
                <td>{doc.cliente}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DocumentList;
