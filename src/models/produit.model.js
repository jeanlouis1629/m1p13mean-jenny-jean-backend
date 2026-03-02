const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema({
  nom: {type: String ,required:true},
  prix: {type: Number,required: true},
  description: { type: String },
  promotion: {type: Number, default: 0},
  activepromo: {type:Boolean, default:false},
  stock: {type: Number,required:true},
  boutiqueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Boutiques' },
  statut: { type: Boolean, default: true },
  image: {type: String}
},{timestamps:true});

module.exports = mongoose.model('Produit', ProduitSchema,'produits'); 