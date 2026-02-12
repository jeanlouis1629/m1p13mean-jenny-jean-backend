const router = require('express').Router();
const controller = require('../controllers/commande.controller');

router.post('/ajouter', controller.ajouterCommande);
router.put('/statut/:id', controller.modifierStatutCommande);
router.get('/boutique/:idBoutique', controller.commandesParBoutique);
module.exports = router;