const express = require('express');
const router = express.Router();
const controller = require('../controllers/stock.controller');

router.post('/mouvement', controller.mouvementStock);

module.exports = router;