const cron = require('node-cron');
const { checkForExpiringProducts } = require('../services/alertService');

// Schedule daily expiry checks at 9 AM
exports.scheduleExpiryChecks = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily expiry check...');
    await checkForExpiringProducts();
  }, {
    scheduled: true,
    timezone: 'America/New_York' // Adjust to your timezone
  });
  
  console.log('Scheduled daily expiry checks at 9 AM');
};