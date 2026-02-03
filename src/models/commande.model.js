const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
  acheteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  produits: [
    {
      produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
      quantite: Number
    }
  ],
  boutiques: {type:mongoose.Schema.Types.ObjectId, ref:'Boutiques'},
  total: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Commande', CommandeSchema);