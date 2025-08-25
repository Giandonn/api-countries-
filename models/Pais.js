const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Pais = sequelize.define('Pais', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  curti: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  naoCurti: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'paises',
  timestamps: false
});

module.exports = Pais;