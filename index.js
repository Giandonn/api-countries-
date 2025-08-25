const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const paisesRoutes = require('./routes/paises');

const app = express();
app.use(bodyParser.json());

app.use('/paises', paisesRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => console.log('server rodando na 3000'));
});