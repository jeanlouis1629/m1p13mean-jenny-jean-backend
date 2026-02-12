const express = require('express');
const router = express.Router();
const controller = require('../controllers/stock.controller');

router.post('/mouvement', controller.mouvementStock);
router.get('/:produitId', controller.getStockProduit);

module.exports = router;