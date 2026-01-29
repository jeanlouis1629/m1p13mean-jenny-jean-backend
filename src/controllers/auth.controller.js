const User = require('../models/user.model');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password, actif: true });

  if (!user) {
    return res.status(401).json({ message: "Login incorrect" });
  }

  res.json(user);
};