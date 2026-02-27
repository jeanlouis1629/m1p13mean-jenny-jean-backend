const express = require('express');
const router = express.Router();
const financeController = require('../controllers/finance.controller');

router.post('/ajout', financeController.ajouterDepense);
router.get('/mensuel', financeController.financeParMois);
router.get('/performance',financeController.performanceParBoutique);
module.exports = router;