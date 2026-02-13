const mongoose = require('mongoose');
const Boutique = require('../models/boutique.model');
const Performance =require('../models/performance.model');
const Categorie = require('../models/CategorieBoutique');
const User = require('../models/user.model');

exports.createBoutique = async (req, res) => {
  try {

    const {
      nom,
      code,
      description,
      loyerMensuel,
      categorie,
      owner,
      tauxCommission
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(categorie)) {
      return res.status(400).json({ message: "Categorie invalide" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ message: "Owner invalide" });
    }

    const categorieExiste = await Categorie.findById(categorie);
    if (!categorieExiste) {
      return res.status(404).json({ message: "Categorie introuvable" });
    }

    const ownerExiste = await User.findById(owner);
    if (!ownerExiste) {
      return res.status(404).json({ message: "Owner introuvable" });
    }

    const boutique = new Boutique({
      nom,
      code,
      description,
      loyerMensuel,
      categorie,  // ← on stocke juste l’ID
      owner,      // ← on stocke juste l’ID
      tauxCommission,
      active: false
    });

    await boutique.save();

    res.status(201).json({
      message: "Boutique créée, en attente de validation",
      boutique
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
//liste
exports.getBoutique = async (req, res) => {
    try {
        let filter = {};
        const boutiques = await Boutique.find(filter)
          .populate('owner', 'name email')
          .sort({ createdAt: -1 });
    
        res.json(boutiques);
      } catch (error) {
        res.status(500).json({
          message: 'Erreur lors de la récupération des boutiques'
        });
      }
    };


  //liste unique
  exports.getBoutiqueById = async(req,res)=>{
      try{
          const boutique = await Boutique.findById(req.params.id)
          .populate('owner', 'name email')
          res.json(boutique);
      }catch (error){
          res.status(500).json({
              message: 'Erreur lors de la récupération des boutiques'
            });
      }
  };
    
//delete
exports.deleteBoutique = async (req, res) => {
    try {
      const boutique = await Boutique.findById(req.params.id);
  
      if (!boutique) {
        return res.status(404).json({
          message: 'Boutique introuvable'
        });
      }
  
      boutique.active = false;
      await boutique.save();
  
      res.json({
        message: 'Boutique désactivée avec succès'
      });
    } catch (error) {
      res.status(400).json({
        message: 'ID invalide'
      });
    }
  };

// ✏️ Modifier boutique
exports.updateBoutique = async (req, res) => {
  try {
    const boutique = await Boutique.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(boutique);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Activation / Désactivation
exports.toggleBoutique = async (req, res) => {
  const boutique = await Boutique.findById(req.params.id);
  if (!boutique) {
    return res.status(404).json({ message: 'Boutique introuvable' });
  }

  const newStatus = !boutique.active;

  await Boutique.findByIdAndUpdate(
    req.params.id,
    { active: newStatus },
    { new: true }
  );

  res.json({
    message: newStatus ? 'Boutique activée' : 'Boutique désactivée',
    active: newStatus
  });
};

//chiffreDaffaire
exports.getPerformance = async (req, res) => {
    const { id, mois, annee } = req.params;

    const boutique = await Boutique.findById(id);
    if (!boutique) return res.status(404).json({ message: 'Boutique introuvable' });

    const perf = await Performance.findOne({ boutique: id, mois, annee });
    if (!perf) return res.json({ message: 'Aucune donnée pour ce mois' });

    const commission = perf.chiffreAffaire * boutique.tauxCommission / 100;
    const chargesTotales = boutique.loyerMensuel + perf.charges;
    const profit = perf.chiffreAffaire - chargesTotales - commission;

    res.json({
      boutique: boutique.nom,
      mois,
      annee,
      chiffreAffaire: perf.chiffreAffaire,
      charges: perf.charges,
      commission,
      profit
  });
};
//Nombre total boutique
exports.getNombreBoutique = async(req,res)=>{
  try {
    const total = await Boutique.countDocuments();
    const actives = await Boutique.countDocuments({ active: true });
    const inactives = await Boutique.countDocuments({ active: false });

    return res.json({
      total,
      actives,
      inactives
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors du calcul des statistiques"
    });
  }
};