const Boutique = require('../models/boutique.model');

exports.createBoutique = async (req, res) => {
    try {
      const boutique = new Boutique({
        nom: req.body.nom,
        code: req.body.code,
        description: req.body.description,
        loyerMensuel: req.body.loyerMensuel,
        tauxCommission: req.body.tauxCommission,
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

// ✅ Valider / Désactiver
exports.toggleBoutique = async (req, res) => {
  const boutique = await Boutique.findById(req.params.id);
  if (!boutique) return res.status(404).json({ message: 'Boutique introuvable' });

  boutique.active = !boutique.active;
  await boutique.save();

  res.json({
    message: boutique.active ? 'Boutique activée' : 'Boutique désactivée'
  });
};