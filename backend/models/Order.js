const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    username: {
      type: String,
      required: true
    },
    email: String,
    firstName: String,
    lastName: String
  },
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    category: String,
    selectedColor: String,
    selectedSize: String,
    productId: String
  }],
  shippingAddress: {
    fullName: String,
    phoneNumber: String,
    region: String,
    postalCode: String,
    streetName: String,
    label: String
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cod', 'gcash', 'paymaya'],
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    default: 10
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

