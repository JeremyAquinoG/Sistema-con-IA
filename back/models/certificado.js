const db = require("../coneccion/db");
const { DataTypes } = require("sequelize");

const certi = db.define("certificado", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER
  },
  certificado: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  proforma: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  documento: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  emitido: {
    type: DataTypes.DATE,
    allowNull: false 
  },  
  cliente: {
    type: DataTypes.STRING,
    allowNull: false 
  },
  file: { // Agregar campo para el archivo
    type: DataTypes.STRING,
    allowNull: true 
  }
}, {
  timestamps: false
});

module.exports = certi;
