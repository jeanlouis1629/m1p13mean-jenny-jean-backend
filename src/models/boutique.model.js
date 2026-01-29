const mongoose = require('mongoose');

const BoutiqueSchema = new mongoose.Schema({
  nom: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: false }
});

module.exports = mongoose.model('Boutique', BoutiqueSchema);
