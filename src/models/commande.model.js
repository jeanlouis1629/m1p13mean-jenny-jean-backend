const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
  acheteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  produits: [
    {
      produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
      quantite: Number
    }
  ],
  total: {type: Number, required:true},
  date: { type: Date, default: Date.now },
  dateLivraison: { type: Date, required:true},
  modeLivraison: {
    type: String,
    enum: ['Recuperation', 'Livraison'],
    required: true
  },
  adresseLivraison: {
    latitude: Number,
    longitude: Number,
    adresseTexte: String
  },
  statut: {
    type: String,
    enum: ['En attente', 'Confirmée', 'Livrée','Annuler'],
    default: 'En attente'
  }
},{ timestamps: true });
module.exports = mongoose.model('commandes', CommandeSchema,'commandes');