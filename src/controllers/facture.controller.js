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

    doc.fontSize(20).text('FACTURE', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Numéro: ${commande._id}`);
    doc.text(`Date: ${new Date(commande.createdAt).toLocaleDateString()}`);
    doc.text(`Client: ${commande.acheteur?.nom || ''}`);
    doc.moveDown();

    doc.text('Produits:', { underline: true });
    doc.moveDown(0.5);

    let totalGeneral = 0;

    commande.produits.forEach(item => {
      const nom = item.produit?.nom || '';
      const prix = item.produit?.prix || 0;
      const qte = item.quantite;
      const total = prix * qte;

      totalGeneral += total;

      doc.text(`${nom}`);
      doc.text(`   Prix: ${prix} Ar`);
      doc.text(`   Quantité: ${qte}`);
      doc.text(`   Total: ${total} Ar`);
      doc.moveDown();
    });


    doc.moveDown();
    doc.fontSize(14).text(`TOTAL: ${totalGeneral} Ar`, { align: 'right' });

    doc.end();

  } catch (error) {
    res.status(500).json({
      message: "Erreur génération facture",
      error: error.message
    });
  }
};