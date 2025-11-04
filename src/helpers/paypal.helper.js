require('dotenv').config();

const paypalConfig = {
  clientId: process.env.PAYPAL_CLIENT_ID,
  secretKey: process.env.PAYPAL_SECRET_KEY,
  mode: process.env.PAYPAL_MODE || 'sandbox',
};

module.exports = paypalConfig;