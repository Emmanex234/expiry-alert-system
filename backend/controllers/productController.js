const Product = require('../models/Product');
const { sendExpiryAlert } = require('../services/alertService');

exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    // Check if product is expiring soon or expired
    if (product.status === 'expiring_soon') {
      await sendExpiryAlert(product);
    }
    
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ expiryDate: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpiringProducts = async (req, res) => {
  try {
    const products = await Product.findExpiringProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpiredProducts = async (req, res) => {
  try {
    const products = await Product.findExpiredProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.scanProducts = async (req, res) => {
  try {
    const { filter } = req.query;
    let products;
    
    switch(filter) {
      case 'expiring':
        products = await Product.findExpiringProducts();
        break;
      case 'expired':
        products = await Product.findExpiredProducts();
        break;
      default:
        products = await Product.find().sort({ expiryDate: 1 });
    }
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const expiringSoon = await Product.countDocuments({ status: 'expiring_soon' });
    const expired = await Product.countDocuments({ status: 'expired' });
    
    res.json({
      totalProducts,
      expiringSoon,
      expired
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};