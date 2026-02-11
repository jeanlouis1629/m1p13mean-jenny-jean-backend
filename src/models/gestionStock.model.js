const mongoose = require('mongoose');

const GestionStockSchema = new mongoose.Schema({
  produitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'produits',
    required: true
  },
  boutiqueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Boutiques',
    required: true
  },
  typeMouvement: {
    type: String,
    enum: ['ENTREE', 'SORTIE'],
    required: true
  },
  quantite: {
    type: Number,
    required: true
  },
  description: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('mouvements_stock', GestionStockSchema, 'mouvements_stock');
