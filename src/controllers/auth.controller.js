const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
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
        role: user.role
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
