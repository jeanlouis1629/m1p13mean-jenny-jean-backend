const Produit = require('../models/produit.model');

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