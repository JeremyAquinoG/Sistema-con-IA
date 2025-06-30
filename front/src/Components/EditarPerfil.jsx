import React, { useEffect, useState } from "react";
import axios from "axios";
import getURL from "../Config/config";
import Swal from "sweetalert2";
import './EditarPerfil.css';

function EditarPerfil() {
  const [perfil, setPerfil] = useState({
    nombres: "",
    apellidos: "",
    tipo_documento: "",
    numero_documento: "",
    fecha_nacimiento: "",
    genero: "",
    telefono: "",
    direccion: "",
    ocupacion: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(getURL() + "/user/perfil", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setPerfil(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener perfil:", err);
      });
  }, []);

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
console.log("➡️ Enviando perfil al backend:", perfil);

    try {
      await axios.put(getURL() + "/user/actualizar", perfil, {
        headers: { Authorization: `Bearer ${token}` }
      });
       localStorage.setItem("nombres", perfil.nombres);
  localStorage.setItem("apellidos", perfil.apellidos);


      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        text: "Tus datos fueron guardados correctamente"
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el perfil"
      });
    }
  };

  return (
 <div className="formulario-perfil">
  <h2>Editar Perfil</h2>
  <form onSubmit={handleSubmit}>
    <div className="form-row">
      <div className="form-col-6">
        <label>Nombres</label>
        <input type="text" name="nombres" value={perfil.nombres} onChange={handleChange} />
      </div>
      <div className="form-col-6">
        <label>Apellidos</label>
        <input type="text" name="apellidos" value={perfil.apellidos} onChange={handleChange} />
      </div>
      <div className="form-col-6">
        <label>Tipo de documento</label>
        <input type="text" name="tipo_documento" value={perfil.tipo_documento} onChange={handleChange} />
      </div>
      <div className="form-col-6">
        <label>Número de documento</label>
        <input type="text" name="numero_documento" value={perfil.numero_documento} onChange={handleChange} />
      </div>
      <div className="form-col-6">
        <label>Fecha de nacimiento</label>
        <input type="date" name="fecha_nacimiento" value={perfil.fecha_nacimiento?.split("T")[0] || ""} onChange={handleChange} />
      </div>
     <div className="form-col-6">
  <label>Género</label>
  <select
    name="genero"
    value={perfil.genero}
    onChange={handleChange}
  >
    <option value="">Seleccionar</option>
    <option value="Masculino">Masculino</option>
    <option value="Femenino">Femenino</option>
    <option value="Otro">Otro</option>
  </select>
</div>

      <div className="form-col-6">
        <label>Teléfono</label>
        <input type="text" name="telefono" value={perfil.telefono} onChange={handleChange} />
      </div>
      <div className="form-col-6">
        <label>Dirección</label>
        <input type="text" name="direccion" value={perfil.direccion} onChange={handleChange} />
      </div>
      <div className="form-col-12">
        <label>Ocupación</label>
        <input type="text" name="ocupacion" value={perfil.ocupacion} onChange={handleChange} />
      </div>
    </div>
    <button className="btn-guardar">Guardar cambios</button>
  </form>
</div>

  );
}

export default EditarPerfil;
