const PDFDocument = require('pdfkit');
const Commande = require('../models/commande.model');
const mongoose = require('mongoose');

exports.genererFacture = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const commande = await Commande.findById(id)
      .populate('acheteur')
      .populate({
        path: 'produits.produit',
        model: 'Produit'
      });

    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=facture-${commande._id}.pdf`
    );

    doc.pipe(res);

    // Titre
    doc.fontSize(20).text('FACTURE', { align: 'center' });
    doc.moveDown();

    // Informations client
    doc.fontSize(12);
    doc.text(`Numéro: ${commande._id}`);
    doc.text(`Date: ${new Date(commande.createdAt).toLocaleDateString()}`);
    doc.text(`Client: ${commande.acheteur?.nom || ''}`);
    doc.moveDown(2);

    // Position du tableau
    let tableTop = doc.y;
    const col1 = 50;
    const col2 = 250;
    const col3 = 350;
    const col4 = 450;

    // En-tête du tableau
    doc.fontSize(12).text("Produit", col1, tableTop);
    doc.text("Prix", col2, tableTop);
    doc.text("Quantité", col3, tableTop);
    doc.text("Total", col4, tableTop);

    doc.moveTo(50, tableTop + 15)
       .lineTo(550, tableTop + 15)
       .stroke();

    let y = tableTop + 25;
    let totalGeneral = 0;

    commande.produits.forEach(item => {

      const nom = item.produit?.nom || '';
      const prix = item.produit?.prix || 0;
      const qte = item.quantite || 0;
      const total = prix * qte;

      totalGeneral += total;

      doc.text(nom, col1, y);
      doc.text(prix + " Ar", col2, y);
      doc.text(qte, col3, y);
      doc.text(total + " Ar", col4, y);

      y += 20;
    });

    // Ligne séparatrice
    doc.moveTo(50, y)
       .lineTo(550, y)
       .stroke();

    // Total général
    doc.moveDown();
    doc.fontSize(14)
       .text(`TOTAL : ${totalGeneral} Ar`, 400, y + 20);

    doc.end();

  } catch (error) {
    res.status(500).json({
      message: "Erreur génération facture",
      error: error.message
    });
  }
};