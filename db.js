const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('paises', 'root', '123', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;