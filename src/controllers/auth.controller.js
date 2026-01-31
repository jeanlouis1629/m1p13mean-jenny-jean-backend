const mongoose = require('mongoose'); 
const User = require('../models/user.model');

exports.login = async (req, res) => {
  console.log("HEADERS :", req.headers);
    console.log("BODY :", req.body);
  if (!req.body) {
    return res.status(400).json({
      message: "Body requis"
    });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email et mot de passe obligatoires"
    });
  }
  console.log("Base MongoDB:", mongoose.connection.name);
  console.log("Collections:", await mongoose.connection.db.listCollections().toArray());
  const user = await User.findOne({ email, password, actif: true });

  if (!user) {
    return res.status(401).json({ message: "Login incorrect" });
  }

  res.json({ message: "Connexion réussie", user });
}