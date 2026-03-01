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

  const depensesCentre = await Depense.find({
    type: 'CHARGES',
    date: { $gte: debut, $lt: fin }
  });

  const totalChargesCentre = depensesCentre.reduce(
    (sum, d) => sum + (Number(d.montant) || 0),
    0
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
  const benefices = revenuCentre - totalChargesCentre;

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
    revenuCentre,
    benefices,
    totalChargesCentre
  };
};

exports.performanceParBoutique = async (mois) => {

  const debut = new Date(`${mois}-01`);
  const fin = new Date(debut);
  fin.setMonth(fin.getMonth() + 1);

  const boutiques = await Boutique.find({ active: true });

  const resultats = [];

  for (const boutique of boutiques) {


    const commandes = await Commande.find({
      statut: { $in: ['Confirmée', 'Livrée'] },
      createdAt: { $gte: debut, $lt: fin }
    }).populate({
      path: 'produits.produit',
      match: { boutiqueId: boutique._id }
    });

    let chiffreAffaire = 0;

    for (const commande of commandes) {
      for (const item of commande.produits) {

        if (!item.produit) continue;

        const prix = Number(item.produit.prix) || 0;
        const quantite = Number(item.quantite) || 0;

        chiffreAffaire += prix * quantite;
      }
    }

    const depenses = await Depense.find({
      boutique: boutique._id,
      date: { $gte: debut, $lt: fin }
    });

    const totalCharges = depenses.reduce(
      (sum, d) => sum + (Number(d.montant) || 0),
      0
    );

    const profit = chiffreAffaire - totalCharges;

    resultats.push({
      boutique: boutique.nom,
      chiffreAffaire,
      charges: totalCharges,
      profit,
      statut: profit >= 0 ? "PROFIT" : "PERTE"
    });
  }

  return {
    mois,
    totalBoutiques: resultats.length,
    performances: resultats
  };
};
