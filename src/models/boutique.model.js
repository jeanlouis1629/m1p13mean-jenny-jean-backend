const mongoose = require('mongoose');

const BoutiqueSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
  loyerMensuel: { type: Number, required: true },
  tauxCommission: { type: Number, required: true },
  active: { type: Boolean, default: false },
},{ timestamps: true });
module.exports = mongoose.model('Boutiques', BoutiqueSchema,'Boutiques');
