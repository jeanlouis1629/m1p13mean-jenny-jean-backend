const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

router.post('/login', authCtrl.login);
router.post('/insertUser', authCtrl.register);
router.get('/selectShop', authCtrl.selectShop);
router.get('/selectAllUser', authCtrl.selectAllUser);
router.patch('/:id/activation', authCtrl.toggleUser);


module.exports = router;