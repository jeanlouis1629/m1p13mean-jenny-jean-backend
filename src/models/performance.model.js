const mongoose =require('mongoose');

const PerfomanceSchema = new mongoose.Schema({
    boutique: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Boutiques',
        required: true
      },
      mois: { type: Number, required: true },
      annee: { type: Number, required: true },
    
      chiffreAffaire: { type: Number, default: 0 },
      charges: { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model('Performance', PerfomanceSchema, 'Performance');