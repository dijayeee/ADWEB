const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const User = require('../models/User');

router.post('/add', async (req, res) => {
    try {
        const { name, email } = req.body;
        const newUser = new User({ name, email });
        await newUser.save();

        res.json({ message: 'User added successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
=======
const User = require('../models/Users');

// Register/Signup
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone, gender, profileImage } = req.body;

    // Validation for required fields
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please fill in all required fields (username, email, password, firstName, lastName)' 
      });
    }

    // Validate username length
    if (username.trim().length < 3) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username must be at least 3 characters long' 
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please enter a valid email address' 
      });
    }

    // Validate gender if provided
    if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Gender must be one of: Male, Female, Other' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ username: username.trim() }, { email: email.toLowerCase().trim() }] 
    });

    if (existingUser) {
      const field = existingUser.username === username.trim() ? 'username' : 'email';
      return res.status(400).json({ 
        success: false, 
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` 
      });
    }

    // Create new user
    const user = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone ? phone.trim() : '',
      gender: gender || 'Male',
      profileImage: profileImage || ''
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        gender: user.gender,
        profileImage: user.profileImage,
        usernameChanged: user.usernameChanged,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        error: errors.join(', ') 
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        success: false, 
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Server error during registration' 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide username and password' 
      });
    }

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password' 
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password' 
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        gender: user.gender,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error during login' 
    });
  }
});

// Get user profile
router.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        gender: user.gender,
        profileImage: user.profileImage,
        addresses: user.addresses,
        usernameChanged: user.usernameChanged
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Update user profile
router.put('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { email, firstName, lastName, phone, gender, profileImage, username: newUsername } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Update username (only if not changed before)
    if (newUsername && newUsername !== username && !user.usernameChanged) {
      const usernameExists = await User.findOne({ 
        username: newUsername,
        _id: { $ne: user._id } 
      });
      if (usernameExists) {
        return res.status(400).json({ 
          success: false, 
          error: 'Username already in use' 
        });
      }
      user.username = newUsername;
      user.usernameChanged = true;
    }

    // Update fields if provided
    if (email) {
      const emailExists = await User.findOne({ 
        email, 
        _id: { $ne: user._id } 
      });
      if (emailExists) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email already in use' 
        });
      }
      user.email = email;
    }
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        gender: user.gender,
        profileImage: user.profileImage,
        usernameChanged: user.usernameChanged
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Add address
router.post('/address/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { fullName, phoneNumber, region, postalCode, streetName, label } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    const newAddress = {
      fullName,
      phoneNumber,
      region,
      postalCode,
      streetName,
      label: label || 'Home',
      isDefault: user.addresses.length === 0 // First address is default
    };

    user.addresses.push(newAddress);
    await user.save();

    res.json({
      success: true,
      message: 'Address added successfully',
      address: newAddress
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Delete address
router.delete('/address/:username/:index', async (req, res) => {
  try {
    const { username, index } = req.params;
    const addressIndex = parseInt(index, 10);

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    if (addressIndex < 0 || addressIndex >= user.addresses.length) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid address index' 
      });
    }

    user.addresses.splice(addressIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Set default address
router.put('/address/:username/:index/set-default', async (req, res) => {
  try {
    const { username, index } = req.params;
    const addressIndex = parseInt(index, 10);

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    if (addressIndex < 0 || addressIndex >= user.addresses.length) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid address index' 
      });
    }

    // Set all addresses to not default
    user.addresses.forEach((addr, idx) => {
      addr.isDefault = idx === addressIndex;
    });

    await user.save();

    res.json({
      success: true,
      message: 'Default address updated successfully'
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Change password
router.put('/change-password/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide current and new password' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'New password must be at least 6 characters long' 
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        error: 'Current password is incorrect' 
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Get all users (Admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Delete user (Admin only)
router.delete('/users/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Prevent deleting admin user
    if (username === 'admin') {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete admin user' 
      });
    }

    const user = await User.findOneAndDelete({ username });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

module.exports = router;

>>>>>>> 9676373 (Initial commit)
