const { DataTypes } = require('sequelize');
const db = require('../coneccion/db');

const user = db.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = user;
