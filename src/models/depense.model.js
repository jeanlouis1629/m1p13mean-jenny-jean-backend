const mongoose =require('mongoose');

const DepenseSchema = new mongoose.Schema({
    boutique: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Boutiques',
        required: true
      },
      type: {
        type: String,
        enum: ['LOYER', 'CHARGES', 'PROMOTION'],
        required: true
      },
      montant: { type: Number, required: true },
      description: { type: String },
      date: {
        type: Date,
        default: Date.now
      }
}, { timestamps: true });
module.exports = mongoose.model('depense', DepenseSchema, 'depense');