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
    enum: ['retrait', 'livraison'],
    required: true
  },
  adresseLivraison: {
    latitude: {
      type: Number,
      required: function () {
        return this.modeLivraison === 'livraison';
      }
    },
    longitude: {
      type: Number,
      required: function () {
        return this.modeLivraison === 'livraison';
      }
    },
    adresseTexte: {
      type: String,
      required: function () {
        return this.modeLivraison === 'livraison';
      }
    }
  },
  statut: {
    type: String,
    enum: ['En attente', 'Confirmée', 'Livrée','Annuler'],
    default: 'En attente'
  }
},{ timestamps: true });
module.exports = mongoose.model('commandes', CommandeSchema,'commandes');