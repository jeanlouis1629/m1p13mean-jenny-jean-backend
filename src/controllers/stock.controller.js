const GestionStock = require('../models/gestionStock.model');
const Produit = require('../models/produit.model');
const mongoose = require('mongoose');

exports.mouvementStock = async (req, res) => {
  try {
    const { produitId, boutiqueId, typeMouvement, quantite, description } = req.body;

    if (!produitId || !boutiqueId || !typeMouvement || !quantite) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const produit = await Produit.findById(produitId);

    if (!produit) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    // 🔥 Gestion logique du stock
    if (typeMouvement === 'ENTREE') {
      produit.stock += quantite;
    } 
    else if (typeMouvement === 'SORTIE') {
      if (produit.stock < quantite) {
        return res.status(400).json({ message: "Stock insuffisant" });
      }
      produit.stock -= quantite;
    }

    await produit.save();

    const mouvement = new GestionStock({
      produitId,
      boutiqueId,
      typeMouvement,
      quantite,
      description
    });

    await mouvement.save();

    res.status(200).json({
      message: "Mouvement de stock effectué avec succès",
      produit
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors du mouvement de stock",
      error: error.message
    });
  }
};
