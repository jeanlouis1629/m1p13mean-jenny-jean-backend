const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/user.model');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash('shop01', 10);

  const admin = await User.create({
    name: 'Box01',
    email: 'shop01@gmail.com',
    password: hashedPassword,
    role: 'SHOP',
    actif: true
  });

  console.log('✅ Admin créé :', admin.email);
  process.exit();
}

run();
