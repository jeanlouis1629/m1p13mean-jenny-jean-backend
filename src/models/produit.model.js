const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema({
  nom: String,
  prix: Number,
  description: String,
  boutique: { type: mongoose.Schema.Types.ObjectId, ref: 'Boutique' },
  image: String
});

module.exports = mongoose.model('Produit', ProduitSchema);