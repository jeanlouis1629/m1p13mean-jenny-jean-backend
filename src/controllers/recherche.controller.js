const mongoose = require('mongoose');
const Boutique = require('../models/boutique.model');
const Produit = require('../models/produit.model');

exports.globalSearch = async (req, res) => {
  try {
    const { q = '', categorie } = req.query;

    console.log('Recherche:', { q, categorie });

    const boutiqueFilter = {};

    if (categorie && categorie !== 'all') {
      boutiqueFilter.categorie = new mongoose.Types.ObjectId(categorie);
    }

    if (q && q.trim() !== '') {
      boutiqueFilter.$or = [
        { nom: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    const boutiques = await Boutique.find(boutiqueFilter)
      .populate('categorie')
      .limit(20);

    let produits = [];
    if (q && q.trim() !== '') {
      produits = await Produit.find({
        nom: { $regex: q, $options: 'i' }
      }).limit(20);
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