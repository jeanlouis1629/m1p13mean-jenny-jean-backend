const express = require('express');
const router = express.Router();
const { genererFacture } = require('../controllers/facture.controller');

router.get('/commande/:id/facture', genererFacture);

module.exports = router;