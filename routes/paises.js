const express = require('express');
const router = express.Router();
const axios = require('axios');
const Pais = require('../models/Pais');
const sequelize = require('../db');
const PaisService = require('../services/PaisesService');

router.get('/top10', async (req, res) => {
  try {
    const countries = await PaisService.getTop10();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get('/buscar', async (req, res) => {
  const { nome } = req.query;
  if (!nome) return res.status(400).json({ erro: 'Nome do país obrigatório' });

  try {
    const country = await PaisService.buscarPais(nome);
    res.json(country);
  } catch (err) {
    res.status(404).json({ erro: 'País não encontrado' });
  }
});

router.post('/avaliar', async (req, res) => {
  try {
    const { pais, tipoCurtida } = req.body;
    if (!pais) return res.status(400).json({ erro: 'Dados inválidos' });

    if (tipoCurtida === 1) {
      await PaisService.curtirPais(pais);
    } else if (tipoCurtida === 0) {
      await PaisService.naoCurtirPais(pais);
    } else {
      return res.status(400).json({ status: 'erro', msg: 'O tipo de curtida deve ser 0 ou 1' });
    }

    const votos = await PaisService.pegarVotos(pais);
    res.json({ pais, status: 'sucesso',  votosComputadosTotal: votos.totalVotos });

  } catch (err) {
    res.status(500).json({ status: 'erro', erro: err.message });
  }
});

module.exports = router;