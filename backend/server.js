const express = require('express');
<<<<<<< HEAD
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin', adminRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB is Connected Successfully!'))
    .catch(err => console.error('MongoDB connection failed:', err));

app.get('/', (req, res) => res.send('API is running. . . '));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server started on port', PORT));
=======
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const app = express();

// Import models and routes
const User = require('./models/Users');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const orderRoutes = require('./routes/orderRoutes');

//middleware
app.use(express.json());
app.use(cors());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//mongoDB connection
mongoose.connect(process.env.MONGO_URI)
        .then(async () => {
          console.log("MongoDB is connected!!");
          
          // Initialize admin account if it doesn't exist
          try {
            const adminExists = await User.findOne({ username: 'admin' });
            if (!adminExists) {
              const adminUser = new User({
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
              console.log('Admin account created successfully');
            } else {
              console.log('Admin account already exists');
            }
          } catch (error) {
            console.error('Error initializing admin account:', error);
          }
        })
        .catch((err) => console.error("MongoDB connection error:", err));
 
// Routes
app.get('/', (req, res) => res.send("API is running"));
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);

//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
>>>>>>> 9676373 (Initial commit)
