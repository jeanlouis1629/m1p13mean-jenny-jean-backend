const express = require('express');
const router = express.Router();
const financeController = require('../controllers/finance.controller');

router.post('/ajout', financeController.ajouterDepense);

module.exports = router;