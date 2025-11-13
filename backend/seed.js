const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (adminExists) {
      console.log('Admin account already exists!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin account created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');

    const userExists = await User.findOne({ email: 'user@example.com' });
    if (!userExists) {
      const testUser = new User({
        name: 'Test User',
        email: 'user@example.com',
        password: await bcrypt.hash('user123', salt),
        role: 'user'
      });
      await testUser.save();
      console.log('\n✅ Test user created successfully!');
      console.log('Email: user@example.com');
      console.log('Password: user123');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
    process.exit(1);
  }
};

seedAdmin();
