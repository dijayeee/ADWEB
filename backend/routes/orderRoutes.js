const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/ProductsBE');

// Create new order
router.post('/', async (req, res) => {
  try {
    const {
      user,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      total
    } = req.body;

    // Basic Validation for required order fields
    if (!user || !items || !paymentMethod || !total) {
      return res.status(400).json({
        success: false,
        error: 'Missing required order fields'
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order must contain at least one item'
      });
    }

    // Validate shipping address fields to prevent empty objects
    const requiredAddressFields = ['fullName', 'phoneNumber', 'streetName', 'region', 'postalCode'];
    if (!shippingAddress || typeof shippingAddress !== 'object' || requiredAddressFields.some(field => !shippingAddress[field])) {
      return res.status(400).json({
        success: false,
        error: 'Missing required shipping address fields'
      });
    }

    const order = new Order({
      user,
      items,
      shippingAddress,
      paymentMethod,
      subtotal: subtotal || 0,
      shipping: shipping || 10,
      tax: tax || 0,
      total,
      status: 'pending'
    });

    await order.save();

    // Reduce stock and increment soldCount for each product in the order
    for (const item of items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(
          item.productId,
          { 
            $inc: { 
              stock: -item.quantity,
              soldCount: item.quantity
            } 
          },
          { new: true }
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: order._id,
        user: order.user,
        items: order.items,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during order creation'
    });
  }
});

// Get all orders (Admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Get orders by username
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const orders = await Order.find({ 'user.username': username }).sort({ createdAt: -1 });
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Update order status (Admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Delete order (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;

