const mongoose = require('mongoose');
const Boutique = require('../models/boutique.model');
const Produit = require('../models/produit.model');

exports.globalSearch = async (req, res) => {
  try {
    const { q = '', categorie } = req.query;

    const query = q.trim();

    const boutiqueFilter = {};

    if (categorie && categorie !== 'all') {
      boutiqueFilter.categorie = new mongoose.Types.ObjectId(categorie);
    }

    if (query) {
      boutiqueFilter.$or = [
        { nom: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    const boutiques = await Boutique.find(boutiqueFilter)
      .populate('categorie')
      .limit(20);

    // ✅ FIX ICI
    let produits;

    if (query) {
      produits = await Produit.find({
        nom: { $regex: query, $options: 'i' }
      }).limit(20);
    } else {
      // 👉 afficher tous les produits si q vide
      produits = await Produit.find().limit(20);
    }

    res.status(200).json({
      boutiques,
      produits
    });

  } catch (error) {
    console.error('Erreur recherche:', error);
    res.status(500).json({
      message: 'Erreur serveur recherche',
      error: error.message
    });
  }
};