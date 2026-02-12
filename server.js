const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/boutiques', require('./src/routes/boutique.routes'));
app.use('/api/produits', require('./src/routes/produit.routes'));
app.use('/api/stock', require('./src/routes/gestionStock.routes'));
app.use('/api/categorie', require('./src/routes/categorie.routes'));
app.use('/api/commandes', require('./src/routes/commande.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`)
);
