const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

const shopperUserModel = require('./models/Users');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connection established');

    try {
      const adminExists = await shopperUserModel.findOne({ username: 'admin' });
      if (!adminExists) {
        const adminUser = new shopperUserModel({
          username: 'admin',
          email: 'admin@shophub.com',
          password: 'admin123',
          firstName: 'Admin',
          lastName: 'User',
          phone: '',
          gender: 'Male',
          profileImage: ''
        });
        await adminUser.save();
        console.log('Default storefront admin account created');
      }
    } catch (seedError) {
      console.error('Error ensuring default admin account:', seedError);
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => res.send('API is running'));
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
