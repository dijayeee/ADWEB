const express = require('express');
const router = express.Router();
const Product = require('../models/ProductsBE');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Get products by category (MUST come before /:id route)
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const validCategories = ['Women', 'Men', 'Kids', 'Baby'];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid category. Must be one of: Women, Men, Kids, Baby' 
      });
    }

    const products = await Product.find({ category }).sort({ createdAt: -1 });

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Get product by ID (MUST come after /category/:category route)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid product ID' 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const { name, price, stock, image, category, colors, sizes, description } = req.body;

    // Validation
    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide name, price, and stock' 
      });
    }

    if (price < 0 || stock < 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Price and stock must be non-negative' 
      });
    }

    if (category && !['Women', 'Men', 'Kids', 'Baby'].includes(category)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid category. Must be one of: Women, Men, Kids, Baby' 
      });
    }

    const product = new Product({
      name,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      image: image || '',
      category: category || 'Women',
      colors: Array.isArray(colors) ? colors : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      description: description || ''
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { name, price, stock, image, category, colors, sizes, description } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }

    // Update fields if provided
    if (name) product.name = name;
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Price must be non-negative' 
        });
      }
      product.price = parseFloat(price);
    }
    if (stock !== undefined) {
      if (stock < 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Stock must be non-negative' 
        });
      }
      product.stock = parseInt(stock, 10);
    }
    if (image !== undefined) product.image = image;
    if (description !== undefined) product.description = description;
    if (category) {
      if (!['Women', 'Men', 'Kids', 'Baby'].includes(category)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid category' 
        });
      }
      product.category = category;
    }
    if (Array.isArray(colors)) product.colors = colors;
    if (Array.isArray(sizes)) product.sizes = sizes;

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid product ID' 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid product ID' 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

module.exports = router;

