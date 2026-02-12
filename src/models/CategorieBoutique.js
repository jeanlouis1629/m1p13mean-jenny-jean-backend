const mongoose = require('mongoose');
const CategorieSchema = new mongoose.Schema({
    nomCategorie:{type: String, required: true},
    description:{type: String, required: true}
},{ timestamps: true });
module.exports = mongoose.model('categorieBoutique', CategorieSchema,'categorieBoutique');