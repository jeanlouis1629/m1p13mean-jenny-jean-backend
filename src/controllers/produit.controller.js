const Produit = require('../models/produit.model');
//insert
exports.createProduit = async (req , res) =>{
    try{
        const produit = new Produit({
            nom: req.body.nom,
            prix: req.body.prix,
            stock: req.body.stock,
            description: req.body.description,
            boutiqueId: req.body.boutiqueId,
            statut: false,
            image: req.body.image
        });
        await produit.save();

        res.status(201).json({
            message: "Produit cree",
            produit
        });
    }
    catch (error){
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











//update
exports.updateProduit = async(req,res)=>{
    try{
      const produits = await Produit.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
      );
      res.json(produits);
    }catch (error){
        res.status(500).json({
            message: 'Erreur lors de la récupération des Produits'
          });
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