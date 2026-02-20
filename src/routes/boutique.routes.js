const router = require('express').Router();
const controller = require('../controllers/boutique.controller');

router.post('/create', controller.createBoutique);
router.get('/liste', controller.getBoutique);
router.get('/liste/:id', controller.getBoutiqueById);
router.get('/user/:owner', controller.getBoutiqueUser);
router.delete('/:id/delete', controller.deleteBoutique);
router.put('/:id/update', controller.updateBoutique);
router.patch('/:id/activation', controller.toggleBoutique);
router.get('/:id/performance/:mois/:annee', controller.getPerformance);
router.get('/stats/count', controller.getNombreBoutique);

module.exports = router;