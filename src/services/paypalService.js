const paypalConfig = require('../helpers/paypal.helper');

const getPaypalConfig = () => {
  return {
    clientId: paypalConfig.clientId,
    secretKey: paypalConfig.secretKey,
    mode: paypalConfig.mode,
  };
};

module.exports = { getPaypalConfig };
