const Depense = require('../models/depense.model');
const Commande = require('../models/commande.model');
const mongoose = require('mongoose');

exports.ajouterDepense = async (req, res) => {
  try {
    const depense = new Depense({
      boutique: req.body.boutique,
      type: req.body.type,
      montant: req.body.montant,
      description: req.body.description
    });

    await depense.save();
    res.status(201).json(depense);

  } catch (error) {
    res.status(500).json({ message: 'Erreur ajout dépense' });
  }
};