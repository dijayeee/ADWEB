const express = require('express');
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