const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

// Utility function to handle stock updates and transactions
const updateStockAndLog = async (productId, quantity, type) => {
  const product = await Product.findById(productId);
  if (!product) {
    return { success: false, status: 404, message: 'Product not found' };
  }

  let newStock = product.currentStock;

  if (type === 'INCREASE') {
    newStock += quantity;
  } else if (type === 'DECREASE') {
    if (product.currentStock < quantity) {
      // Requirement: Prevent stock from going negative
      return { success: false, status: 400, message: 'Insufficient stock' };
    }
    newStock -= quantity;
  }
  
  // 1. Update stock
  product.currentStock = newStock;
  await product.save();

  // 2. Log transaction
  const transaction = new Transaction({ productId, type, quantity });
  await transaction.save();

  return { success: true, product };
};

// 1. Create Product (POST /products)
router.post('/', async (req, res) => {
  const { name, sku, initialStock } = req.body;

  if (!name || !sku || initialStock === undefined) {
    return res.status(400).json({ message: 'Missing required fields: name, sku, initialStock' });
  }
  if (initialStock < 0) {
    // Requirement: initialStock ≥ 0
    return res.status(400).json({ message: 'initialStock must be non-negative' });
  }

  try {
    const newProduct = new Product({ name, sku, currentStock: initialStock });
    await newProduct.save();

    // Log initial stock as a transaction
    const initialTransaction = new Transaction({
      productId: newProduct._id,
      type: 'INITIAL',
      quantity: initialStock,
    });
    await initialTransaction.save();

    // Requirement: Respond with product details
    res.status(201).json(newProduct);
  } catch (error) {
    // Handle unique SKU error
    if (error.code === 11000) {
      return res.status(409).json({ message: 'SKU already exists', error });
    }
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// 2. Increase Stock (POST /products/:id/increase)
router.post('/:id/increase', async (req, res) => {
  const { quantity } = req.body;
  const productId = req.params.id;

  // Requirement: quantity must be > 0
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be greater than 0' });
  }

  try {
    const result = await updateStockAndLog(productId, quantity, 'INCREASE');
    
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }

    res.json({ message: 'Stock increased successfully', product: result.product });
  } catch (error) {
    res.status(500).json({ message: 'Error increasing stock', error: error.message });
  }
});

// 3. Decrease Stock (POST /products/:id/decrease)
router.post('/:id/decrease', async (req, res) => {
  const { quantity } = req.body;
  const productId = req.params.id;

  // Requirement: quantity > 0
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be greater than 0' });
  }

  try {
    const result = await updateStockAndLog(productId, quantity, 'DECREASE');
    
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }

    res.json({ message: 'Stock decreased successfully', product: result.product });
  } catch (error) {
    res.status(500).json({ message: 'Error decreasing stock', error: error.message });
  }
});

// 4. View Product Summary (GET /products/:id)
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate total increase and total decrease from transactions
    const increaseTransactions = await Transaction.find({ 
      productId, 
      type: { $in: ['INITIAL', 'INCREASE'] } 
    });
    const decreaseTransactions = await Transaction.find({ 
      productId, 
      type: 'DECREASE' 
    });

    const totalIncreased = increaseTransactions.reduce((sum, t) => sum + t.quantity, 0);
    const totalDecreased = decreaseTransactions.reduce((sum, t) => sum + t.quantity, 0);

    // Requirement: Return summary
    res.json({
      productDetails: {
        _id: product._id,
        name: product.name,
        sku: product.sku,
      },
      currentStock: product.currentStock,
      totalIncreased,
      totalDecreased,
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching product summary', error: error.message });
  }
});

// 5. View Transaction History (GET /products/:id/transactions)
router.get('/:id/transactions', async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Check if product exists first
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Requirement: Return list of transactions
    const transactions = await Transaction.find({ productId }).sort({ timestamp: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

module.exports = router;