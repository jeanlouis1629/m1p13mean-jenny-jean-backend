const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    console.log("BODY :", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Body requis" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe obligatoires"
      });
    }

    const user = await User.findOne({ email, actif: true });
    console.log("Base MongoDB:", mongoose.connection.name);
    console.log("Collections:", await mongoose.connection.db.listCollections().toArray());

    if (!user) {
      return res.status(401).json({ message: "Login incorrect" });
    }

    // Comparaison mot de passe crypté
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Login incorrect" });
    }

    // Génération du token JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Erreur login :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
exports.register = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role
  });

  await user.save();
  res.status(201).json({ message: "Utilisateur créé" });
};

exports.selectShop = async (req, res) => {
  try {
    const shop = await User.find({ role: 'SHOP' });
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }

}

exports.selectAllUser = async (req, res) => {
  try {
    const users = await User.find({role: 'USER'});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }

}

// Activation / Désactivation
exports.toggleUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User introuvable' });
  }

  const newStatus = !user.actif ;

  await User.findByIdAndUpdate(
    req.params.id,
    { actif: newStatus },
    { new: true }
  );

  res.json({
    message: newStatus ? 'User activée' : 'User désactivée',
    actif: newStatus
  });
};