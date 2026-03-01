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
    console.log('req.body:', req.body);   // ← Debug: doit contenir nom, prix, etc.
    console.log('req.file:', req.file);   // ← Debug: doit contenir l'image
    
    // Construction explicite des données
    const updateData = {};
    
    // Champs texte (depuis req.body)
    if (req.body.nom) updateData.nom = req.body.nom;
    if (req.body.prix) updateData.prix = req.body.prix;
    if (req.body.stock) updateData.stock = req.body.stock;
    if (req.body.description) updateData.description = req.body.description;
    // ... autres champs
    
    // Image (depuis req.file)
    if (req.file) {
      updateData.image = req.file.filename;
    }
    
    console.log('Données finale:', updateData);

    const produit = await Produit.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(produit);
    
  } catch (error) {
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