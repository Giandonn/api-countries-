const sequelize = require('../db');
const axios = require('axios');

class PaisService {
  
  static async pegarVotos(nomePais) {
    const votos = await sequelize.query(
      'SELECT CURTI, NAO_CURTI FROM paises WHERE NOME = :pais',
      { replacements: { pais: nomePais }, type: sequelize.QueryTypes.SELECT }
    );

    if (votos.length > 0) {
      const curti = votos[0].CURTI;
      const naoCurti = votos[0].NAO_CURTI;
      const totalVotos = curti + naoCurti;
      return { curti, naoCurti, totalVotos };
    } else {
      return { curti: 0, naoCurti: 0, totalVotos: 0 };
    }
  }
  
  static async getTop10() {
    const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags');
    const countries = response.data
      .sort((a, b) => b.population - a.population)
      .slice(0, 10)
      .map(c => ({
        nome: c.name.common,
        regiao: c.region,
        populacao: c.population,
      }));

    for (let country of countries) {
      const votos = await this.pegarVotos(country.nome);

      country.curti = votos.curti;
      country.naoCurti = votos.naoCurti;
      country.totalVotos = votos.totalVotos;
    }

    return countries;
  }

  static async buscarPais(nome) {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${nome}?fields=name,capital,region,population`);
    const country = response.data[0];

    const votos = await this.pegarVotos(country.name.common);

    return {
      nome: country.name.common,
      regiao: country.region,
      populacao: country.population,
      curti: votos.curti,
      naoCurti: votos.naoCurti,
      totalVotos: votos.totalVotos
    };
  }

  static async curtirPais(nomePais) {
    const existe = await sequelize.query(
      'SELECT NOME FROM paises WHERE NOME = :pais',
      { replacements: { pais: nomePais }, type: sequelize.QueryTypes.SELECT }
    );

    if (existe.length > 0) {
      await sequelize.query(
        'UPDATE paises SET CURTI = CURTI + 1 WHERE NOME = :pais',
        { replacements: { pais: nomePais } }
      );
    } else {
      await sequelize.query(
        'INSERT INTO paises (NOME, CURTI) VALUES (:pais, 1)',
        { replacements: { pais: nomePais } }
      );
    }
  }

  static async naoCurtirPais(nomePais) {
    const existe = await sequelize.query(
      'SELECT NOME FROM paises WHERE NOME = :pais',
      { replacements: { pais: nomePais }, type: sequelize.QueryTypes.SELECT }
    );

    if (existe.length > 0) {
      await sequelize.query(
        'UPDATE paises SET NAO_CURTI = NAO_CURTI + 1 WHERE NOME = :pais',
        { replacements: { pais: nomePais } }
      );
    } else {
      await sequelize.query(
        'INSERT INTO paises (NOME, NAO_CURTI) VALUES (:pais, 1)',
        { replacements: { pais: nomePais } }
      );
    }
  }

}

module.exports = PaisService;