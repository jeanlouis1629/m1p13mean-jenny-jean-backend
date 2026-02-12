const mongoose = require('mongoose');
const Commande = require('../models/commande.model');
const Produit = require('../models/produit.model');

exports.ajouterCommande = async (req, res) => {
    try {
      const {
        acheteur,
        produits,
        dateLivraison,
        modeLivraison,
        adresseLivraison
      } = req.body;

      if (!produits || produits.length === 0) {
        return res.status(400).json({ message: "Aucun produit sélectionné" });
      }
  
      let total = 0;
  
      for (let item of produits) {
        const produitDB = await Produit.findById(item.produit);
  
        if (!produitDB) {
          return res.status(404).json({ message: "Produit introuvable" });
        }
  
        total += produitDB.prix * item.quantite;
      }
  
      const nouvelleCommande = new Commande({
        acheteur,
        produits,
        total,
        dateLivraison,
        modeLivraison,
        adresseLivraison: modeLivraison === 'Livraison' ? adresseLivraison : null,
        statut: "En attente"
      });
  
      await nouvelleCommande.save();
  
      res.status(201).json({
        message: "Commande créée avec succès (En attente)",
        commande: nouvelleCommande
      });
  
    } catch (error) {
      res.status(500).json({
        message: "Erreur création commande",
        error: error.message
      });
    }
  };
  exports.modifierStatutCommande = async (req, res) => {
    try {
      const { id } = req.params;
      const { statut } = req.body;
  
      if (!['En attente', 'Confirmée', 'Livrée','Annuler'].includes(statut)) {
        return res.status(400).json({ message: "Statut invalide" });
      }
  
      const commande = await Commande.findById(id);
  
      if (!commande) {
        return res.status(404).json({ message: "Commande introuvable" });
      }
  
      // 🔥 Si on passe à Confirmée ET que ce n'était pas déjà Confirmée
      if (statut === "Confirmée" && commande.statut !== "Confirmée") {
  
        for (let item of commande.produits) {
  
          const produit = await Produit.findById(item.produit);
  
          if (!produit) {
            return res.status(404).json({ message: "Produit introuvable" });
          }
  
          if (produit.stock < item.quantite) {
            return res.status(400).json({
              message: `Stock insuffisant pour ${produit.nom}`
            });
          }
  
          produit.stock -= item.quantite;
          await produit.save();
        }
      }
  
      commande.statut = statut;
      await commande.save();
  
      res.status(200).json({
        message: "Statut mis à jour avec succès",
        commande
      });
  
    } catch (error) {
      res.status(500).json({
        message: "Erreur modification statut",
        error: error.message
      });
    }
  };
  exports.commandesParBoutique = async (req, res) => {
    try {
      const { idBoutique } = req.params;
  
      const commandes = await Commande.find()
        .populate('acheteur')
        .populate({
          path: 'produits.produit',
          model: 'produits'
        });
  
      const commandesFiltrees = commandes
        .map(cmd => {
          const produitsFiltres = cmd.produits.filter(p =>
            p.produit && p.produit.boutiqueId.toString() === idBoutique
          );
  
          if (produitsFiltres.length > 0) {
            return {
              ...cmd.toObject(),
              produits: produitsFiltres
            };
          }
        })
        .filter(Boolean);
  
      res.status(200).json(commandesFiltrees);
  
    } catch (error) {
      res.status(500).json({
        message: "Erreur récupération commandes boutique",
        error: error.message
      });
    }
  };
  