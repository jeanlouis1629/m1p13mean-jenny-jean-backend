const router = require('express').Router();
const controller = require('../controllers/produit.controller');

router.post('/create', controller.createProduit);
router.get('/liste', controller.getProduit);
router.delete('/:id/delete', controller.deleteProduit);
router.put('/:id/update', controller.updateProduit);
// router.patch('/:id/activation', controller.toggleBoutique);

module.exports = router;