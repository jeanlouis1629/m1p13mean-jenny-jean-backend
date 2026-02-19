const Commande = require('../models/commande.model');
const Produit = require('../models/produit.model');
const mongoose = require('mongoose');

exports.getDashboardStats = async (req, res) => {
  try {
    const { boutiqueId } = req.params;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const caJournalier = await Commande.aggregate([
      { $unwind: '$produits' },
      {
        $lookup: {
          from: 'produits',
          localField: 'produits.produit',
          foreignField: '_id',
          as: 'produitDetails'
        }
      },
      { $unwind: '$produitDetails' },
      {
        $match: {
          'produitDetails.boutiqueId': new mongoose.Types.ObjectId(boutiqueId),
          statut: 'Confirmée',
          createdAt: { $gte: todayStart, $lte: todayEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    
    const caMensuel = await Commande.aggregate([
      { $unwind: '$produits' },
      {
        $lookup: {
          from: 'produits',
          localField: 'produits.produit',
          foreignField: '_id',
          as: 'produitDetails'
        }
      },
      { $unwind: '$produitDetails' },
      {
        $match: {
          'produitDetails.boutiqueId': new mongoose.Types.ObjectId(boutiqueId),
          statut: 'Confirmée',
          createdAt: { $gte: monthStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    
    const nombreVentesData = await Commande.aggregate([
      { $unwind: '$produits' },
      {
        $lookup: {
          from: 'produits',
          localField: 'produits.produit',
          foreignField: '_id',
          as: 'produitDetails'
        }
      },
      { $unwind: '$produitDetails' },
      {
        $match: {
          'produitDetails.boutiqueId': new mongoose.Types.ObjectId(boutiqueId),
          statut: 'Confirmée'
        }
      },
      { $group: { _id: '$_id' } },
      { $count: 'nombreVentes' }
    ]);
    const nombreVentes = nombreVentesData[0]?.nombreVentes || 0;
    
    const produitsPlusVendus = await Commande.aggregate([
      { $unwind: '$produits' },
      {
        $lookup: {
          from: 'produits',
          localField: 'produits.produit',
          foreignField: '_id',
          as: 'produitDetails'
        }
      },
      { $unwind: '$produitDetails' },
      {
        $match: {
          'produitDetails.boutiqueId': new mongoose.Types.ObjectId(boutiqueId),
          statut: 'Confirmée'
        }
      },
      {
        $group: {
          _id: '$produits.produit',
          nomProduit: { $first: '$produitDetails.nom' },
          totalVendu: { $sum: '$produits.quantite' }
        }
      },
      { $sort: { totalVendu: -1 } },
      { $limit: 5 }
    ]); 
    const nbCommandeData = await Commande.aggregate([
      { $unwind: '$produits' }, 
      {
        $lookup: {
          from: 'produits',
          localField: 'produits.produit',
          foreignField: '_id',
          as: 'produitDetails'
        }
      },
      { $unwind: '$produitDetails' },
      {
        $match: {
          'produitDetails.boutiqueId': new mongoose.Types.ObjectId(boutiqueId)
        }
      },
      { $group: { _id: '$_id' } },
      { $count: 'nbCommande' }
    ]);
    
    const nbCommande = nbCommandeData[0]?.nbCommande || 0;
    console.log('Nombre de commandes pour cette boutique:', nbCommande);
    

    res.json({
      chiffreAffairesJournalier: caJournalier[0]?.total || 0,
      chiffreAffairesMensuel: caMensuel[0]?.total || 0,
      nombreVentes,
      produitsPlusVendus,
      nbCommande
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur dashboard' });
  }
};
