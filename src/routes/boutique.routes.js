const router = require('express').Router();
const controller = require('../controllers/boutique.controller');

router.post('/create', controller.createBoutique);
router.get('/liste', controller.getBoutique);
router.delete('/:id/delete', controller.deleteBoutique);
router.put('/:id/update', controller.updateBoutique);
router.patch('/:id/activation', controller.toggleBoutique);

module.exports = router;