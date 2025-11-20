const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: ['Women', 'Men', 'Kids', 'Baby'],
    trim: true
  },
  colors: {
    type: [String],
    default: []
  },
  sizes: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster category searches
productSchema.index({ category: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

