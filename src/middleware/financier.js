// src/services/finance.service.js
const Depense = require('../models/depense.model');
const Commande = require('../models/commande.model');
const Boutique = require('../models/boutique.model');

exports.financeParMois = async (mois) => {

  const debut = new Date(`${mois}-01`);
  const fin = new Date(debut);
  fin.setMonth(fin.getMonth() + 1);

 
  const loyersPayes = await Depense.find({
    type: 'LOYER',
    date: { $gte: debut, $lt: fin }
  }).populate('boutique');

  const totalLoyersPayes = loyersPayes.reduce(
    (sum, l) => sum + l.montant, 0
  );

  const boutiques = await Boutique.find();

  const boutiquesAyantPaye = loyersPayes.map(
    l => l.boutique._id.toString()
  );

  const loyersImpayes = boutiques.filter(
    b => !boutiquesAyantPaye.includes(b._id.toString())
  );

  const commandes = await Commande.find({
    statut: { $in: ['Confirmée', 'Livrée'] },
    createdAt: { $gte: debut, $lt: fin }
  })
  .populate({
    path: 'produits.produit',
    populate: {
      path: 'boutiqueId',
      model: 'Boutiques'
    }
  });

  let totalCommissions = 0;

for (const commande of commandes) {
  for (const item of commande.produits) {

    const produit = item.produit;
    if (!produit || !produit.boutiqueId) continue;

    const boutique = produit.boutiqueId;

    const prix = Number(produit.prix) || 0;
    const quantite = Number(item.quantite) || 0;
    const taux = Number(boutique.tauxCommission) || 0;

    const montantProduit = prix * quantite;
    const commission = montantProduit * taux / 100;

    totalCommissions += commission;
  }
}

  const revenuCentre = totalLoyersPayes + totalCommissions;

  return {
    mois,
    loyersPayes: {
      total: totalLoyersPayes,
      details: loyersPayes
    },
    loyersImpayes: {
      nombre: loyersImpayes.length,
      boutiques: loyersImpayes
    },
    commissions: totalCommissions,
    revenuCentre
  };
};
