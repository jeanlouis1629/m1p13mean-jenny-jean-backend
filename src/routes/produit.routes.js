const router = require('express').Router();
const controller = require('../controllers/produit.controller');
const multer = require('multer');

// stockage dans dossier uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });
router.post('/create', upload.single('image'), controller.createProduit);
router.get('/liste', controller.getProduit);
router.get('/liste/:id', controller.getProduitById);
router.get('/prod/:idBoutique', controller.getProduitByIDBoutique);
router.delete('/:id/delete', controller.deleteProduit);
router.put('/:id/update', controller.updateProduit);
// router.patch('/:id/activation', controller.toggleBoutique);

module.exports = router;