const Depense = require('../models/depense.model');
const Commande = require('../models/commande.model');
const financeService = require('../middleware/financier');

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
exports.financeParMois = async (req, res) => {
  try {
    const { mois } = req.query;

    if (!mois) {
      return res.status(400).json({
        message: "Le paramètre mois est obligatoire (YYYY-MM)"
      });
    }

    const data = await financeService.financeParMois(mois);

    res.status(200).json({
      message: "Gestion financière du centre",
      data
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur calcul finance centre",
      error: error.message
    });
  }
};
exports.performanceParBoutique = async (req, res) => {
  try {
    const { mois } = req.query;

    if (!mois) {
      return res.status(400).json({
        message: "Le paramètre mois est obligatoire (YYYY-MM)"
      });
    }

    const data = await financeService.performanceParBoutique(mois);

    res.status(200).json({
      message: "Gestion financière du centre",
      data
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur calcul finance centre",
      error: error.message
    });
  }
};
