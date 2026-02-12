const mongoose = require('mongoose');
const CategorieBoutique = require('../models/CategorieBoutique');

exports.getCategorie = async(req,res)=>{
    try{
        let filtrer ={}
        
        const categorie = await CategorieBoutique.find(filtrer)
        .sort({createdAt: -1});

        res.json(categorie);
    }catch (error){
        res.status(500).json({
            message: 'Erreur lors de la récupération des Produits'
          });
    }
}