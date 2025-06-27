import React, { useEffect, useState } from "react";
import axios from "axios";
import getURL from "../Config/config";
import { FaEdit, FaTrash } from "react-icons/fa";
import './DocumentList.css';
import Swal from "sweetalert2";


function DocumentList() {
  const [documentos, setDocumentos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
  const [eliminados, setEliminados] = useState(() => {
    const guardados = localStorage.getItem("idsEliminados");
    return guardados ? JSON.parse(guardados) : [];
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(getURL() + "/getall");
      const filtrados = response.data.filter(doc => !eliminados.includes(doc.id));
      setDocumentos(filtrados);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const handleEditar = (doc) => {
    setEditandoId(doc.id);
    setFormData({ ...doc });
    setShowModal(true);
  };


  const handleInputChange = (e, campo) => {
    setFormData({ ...formData, [campo]: e.target.value });
  };

  const handleGuardar = async (id) => {
    try {
      await axios.put(
        getURL() + `/actualizar/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const nuevosDocs = documentos.map(doc =>
        doc.id === id ? { ...formData, id } : doc
      );
      setDocumentos(nuevosDocs);
      setEditandoId(null);
      setShowModal(false); // Asegura cerrar el modal

      // ✅ Mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "Documento actualizado",
        text: "Los cambios se guardaron correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error("Error al guardar los cambios:", error);

      // ❌ Mensaje de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el documento.",
      });
    }
  };



  const handleEliminar = (id) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Una vez eliminado, no podrás revertir esta acción.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545", // rojo
    cancelButtonColor: "#6c757d", // gris
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      const nuevosEliminados = [...eliminados, id];
      localStorage.setItem("idsEliminados", JSON.stringify(nuevosEliminados));
      setEliminados(nuevosEliminados);
      setDocumentos((prev) => prev.filter((doc) => doc.id !== id));

      // ✅ Confirmación de éxito
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El documento ha sido eliminado correctamente.",
        timer: 2000,
        showConfirmButton: false
      });
    }
  });
};

  return (
    <div className="contenedor-tabla">
      <div className="encabezado-fijo">
      <h2 className="titulo-tabla">Lista de Documentos Registrados</h2>
      </div>
      <table className="tabla-estilo">
        <thead className="bg-light">
          <tr>
            <th>Nro Certificado</th>
            <th>Nro Proforma</th>
            <th>Nombre del certificado</th>
            <th>Emitido</th>
            <th>Cliente</th>
            <th>Acciones</th>

          </tr>
        </thead>
        <tbody>
          {documentos.length === 0 ? (
            <tr>
              <td colSpan="6" className="acciones">No hay documentos registrados.</td>
            </tr>
          ) : (
            documentos.map((doc, index) => (
              <tr key={index}>
                <td>{doc.certificado || doc.numeroCertificado}</td>
                <td>{doc.proforma || doc.numeroProforma}</td>
                <td>{doc.nombreCertificado || '-'}</td>
                <td>{doc.emitido?.split('T')[0] || doc.fechaEmision?.split('T')[0] || '-'}</td>
                <td>{doc.cliente || doc.razonSocial || '-'}</td>
                <td className="text-center">
                  <FaEdit
                    className="icono-accion icono-editar"
                    onClick={() => handleEditar(doc)}
                    title="Editar"
                  />
                  <FaTrash
                    className="icono-accion icono-eliminar"
                    onClick={() => handleEliminar(doc.id)}
                    title="Eliminar"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-horizontal">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Documento</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <form>
                  {/* FILA 1 */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Número Certificado</label>
                      <input type="text" className="form-control" value={formData.numeroCertificado || ""} onChange={(e) => handleInputChange(e, "numeroCertificado")} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Número Proforma</label>
                      <input type="text" className="form-control" value={formData.numeroProforma || ""} onChange={(e) => handleInputChange(e, "numeroProforma")} />
                    </div>
                  </div>

                  {/* FILA 2 */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Nombre Certificado</label>
                      <input type="text" className="form-control" value={formData.nombreCertificado || ""} onChange={(e) => handleInputChange(e, "nombreCertificado")} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Fecha Emisión</label>
                      <input type="date" className="form-control" value={formData.fechaEmision?.split("T")[0] || ""} onChange={(e) => handleInputChange(e, "fechaEmision")} />
                    </div>
                  </div>

                  {/* FILA 3 */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Razón Social</label>
                      <input type="text" className="form-control" value={formData.razonSocial || ""} onChange={(e) => handleInputChange(e, "razonSocial")} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Dirección</label>
                      <input type="text" className="form-control" value={formData.direccion || ""} onChange={(e) => handleInputChange(e, "direccion")} />
                    </div>
                  </div>

                  {/* Puedes continuar con esta misma estructura para las demás filas */}

                  {/* MÉTODO DE CALIBRACIÓN (último campo) */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Método de Calibración</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.metodoCalibracion || ""}
                      onChange={(e) => handleInputChange(e, "metodoCalibracion")}
                    />
                  </div>
                </form>

              </div>
              <div className="modal-footer d-flex justify-content-center flex-column align-items-center">
                <button
                  className="btn btn-primary btn-pequeno"
                  onClick={() => {
                    handleGuardar(editandoId);
                    setShowModal(false);
                  }}
                >
                  Guardar Cambios
                </button>
                <button
                  className="btn-rojo btn-pequeno"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );

}

export default DocumentList;
