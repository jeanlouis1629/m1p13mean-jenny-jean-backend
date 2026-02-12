const router = require('express').Router();
const controller = require('../controllers/categorie.controller');

router.get('/cat', controller.getCategorie);

module.exports = router;