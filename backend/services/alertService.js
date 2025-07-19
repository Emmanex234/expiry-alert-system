const Product = require('../models/Product');
const { sendEmailAlert, sendSMSAlert } = require('../utils/notifier');

// Send expiry alerts for a product
exports.sendExpiryAlert = async (product) => {
  const message = `Product "${product.name}" (${product.category}) is expiring on ${product.expiryDate.toDateString()}.`;
  
  try {
    // Send email alert
    await sendEmailAlert({
      subject: 'Product Expiry Alert',
      message,
      to: process.env.ADMIN_EMAIL
    });
    
    // Send SMS alert if configured
    if (process.env.TWILIO_ENABLED === 'true') {
      await sendSMSAlert({
        to: process.env.ADMIN_PHONE,
        body: message
      });
    }
    
    console.log(`Alert sent for product: ${product.name}`);
  } catch (err) {
    console.error('Failed to send alert:', err);
  }
};

// Check for expiring products and send alerts
exports.checkForExpiringProducts = async () => {
  try {
    // Find products expiring in the next 7 days
    const expiringProducts = await Product.findExpiringProducts(7);
    
    for (const product of expiringProducts) {
      await sendExpiryAlert(product);
    }
    
    console.log(`Checked for expiring products. Found ${expiringProducts.length} products.`);
  } catch (err) {
    console.error('Error checking for expiring products:', err);
  }
};