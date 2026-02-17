const router = require('express').Router();
const controller = require('../controllers/recherche.controller');

router.get('/recherche', controller.globalSearch);

module.exports = router;