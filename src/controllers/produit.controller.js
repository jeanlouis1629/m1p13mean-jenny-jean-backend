const Produit = require('../models/produit.model');
const mongoose = require('mongoose');
//insert
exports.createProduit = async (req, res) => {
  try {
    const produit = new Produit({
      nom: req.body.nom,
      prix: req.body.prix,
      stock: req.body.stock,
      description: req.body.description,
      boutiqueId: req.body.boutiqueId,
      statut: false,
      image: req.file ? `https://m1p13mean-jenny-jean-backend-1.onrender.com/uploads/${req.file.filename}` : ''
    });

    await produit.save();

    res.status(201).json({
      message: "Produit créé",
      produit
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
//liste
exports.getProduit = async(req,res)=>{
    try{
        let filtrer ={}
        
        const produits = await Produit.find(filtrer)
        .populate('boutiqueId','nom code')
        .sort({createdAt: -1});

        res.json(produits);
    }catch (error){
        res.status(500).json({
            message: 'Erreur lors de la récupération des Produits'
          });
    }
}
//liste unique
exports.getProduitById = async(req,res)=>{
    try{
        const produit = await Produit.findById(req.params.id)
        .populate('boutiqueId','nom code');
        res.json(produit);
    }catch (error){
        res.status(500).json({
            message: 'Erreur lors de la récupération des Produits'
          });
    }
};
//liste produit par boutique
exports.getProduitByIDBoutique = async (req, res) => {
    try {
      const { idBoutique } = req.params;
  
      console.log('ID boutique reçu :', idBoutique);
  
      const produits = await Produit.aggregate([
        {
          $addFields: {
            boutiqueIdStr: {
              $cond: [
                { $eq: [{ $type: '$boutiqueId' }, 'object'] },
                { $toString: '$boutiqueId._id' },
                { $toString: '$boutiqueId' }
              ]
            }
          }
        },
        {
          $match: {
            boutiqueIdStr: idBoutique
          }
        }
      ]);
  
      console.log('Produits trouvés BRUTS :', produits);
  
      if (!produits || produits.length === 0) {
        return res.status(404).json({
          message: 'Aucun produit trouvé pour cette boutique'
        });
      }
  
      res.status(200).json(produits);
  
    } catch (error) {
      console.error('Erreur getProduitByIDBoutique :', error);
      res.status(500).json({
        message: 'Erreur serveur',
        error: error.message
      });
    }
  };
          
  //update
exports.updateProduit = async (req, res) => {
  try {
    console.log('=== UPDATE PRODUIT ===');
    console.log('ID:', req.params.id);
    console.log('Body:', req.body);

    const updateData = {};
    const { nom, prix, stock, description, activepromo, promotion } = req.body;

    // Champs optionnels - on vérifie l'existence, pas la valeur
    if (nom !== undefined) updateData.nom = nom;
    if (prix !== undefined) updateData.prix = Number(prix);
    if (stock !== undefined) updateData.stock = Number(stock);
    if (description !== undefined) updateData.description = description;
    
    // ✅ Gestion explicite de activepromo (peut être "true", "false", true, false)
    if (activepromo !== undefined) {
      // Multer envoie souvent des strings avec multipart/form-data
      const boolValue = activepromo === 'true' || activepromo === true;
      updateData.activepromo = boolValue;
      console.log('activepromo converti:', activepromo, '→', boolValue);
    }
    
    if (promotion !== undefined) {
      updateData.promotion = Number(promotion);
    }

    if (req.file) {
      updateData.image = req.file.filename;
    }

    console.log('UpdateData final:', updateData);

    // Vérifier s'il y a quelque chose à mettre à jour
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
    }

    const produit = await Produit.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },  // $set pour être explicite
      { new: true, runValidators: true }
    );

    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    console.log('Produit mis à jour:', produit);
    res.json(produit);
    
  } catch (error) {
    console.error('Erreur update:', error);
    res.status(500).json({ message: error.message });
  }
};

//Delete
exports.deleteProduit = async(req,res)=>{
    try {
        const { id } = req.params;
    
        const produit = await Produit.findById(id);
        if (!produit) {
          return res.status(404).json({
            message: "Produit introuvable"
          });
        }
    
        await Produit.findByIdAndDelete(id);
    
        return res.status(200).json({
          message: "Produit supprimé définitivement"
        });
    }catch (error){
        onsole.error("Erreur deleteProduit :", error);
    return res.status(500).json({
      message: "Erreur lors de la suppression du produit"
    });
    }  
};
exports.getProduitPromo = async (req, res) => {
  try {

    const produits = await Produit.find({ statut: true })
      .populate('boutiqueId');

    const produitsAvecPromo = produits.map(p => {

      let prixFinal = p.prix;
      let montantReduction = 0;

      if (p.activepromo && p.promotion > 0) {
        montantReduction = (p.prix * p.promotion) / 100;
        prixFinal = p.prix - montantReduction;
      }

      return {
        ...p._doc,
        prixFinal,
        montantReduction
      };
    });

    res.json(produitsAvecPromo);

  } catch (error) {
    console.error("Erreur getProduitPromo :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
exports.setPromotion = async (req, res) => {

  const { promotion, activepromo} = req.body;

  const produit = await Produit.findByIdAndUpdate(
    req.params.id,
    {
      promotion: promotion || 0,
      activepromo: activepromo ?? false
    },
    { new: true }
  );

  res.json(produit);
};
exports.toggleProduit = async (req, res) => {
  const produit = await Produit.findById(req.params.id);
  if (!produit) {
    return res.status(404).json({ message: 'produit introuvable' });
  }

  const newStatus = !produit.statut;

  await Produit.findByIdAndUpdate(
    req.params.id,
    { statut: newStatus },
    { new: true }
  );

  res.json({
    message: newStatus ? 'Produit activée' : 'Produit désactivée',
    active: newStatus
  });
};