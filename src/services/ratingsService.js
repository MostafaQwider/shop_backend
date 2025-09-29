const m = require('../models/ratingsModel');
exports.create = async (data) => {
  const id = await m.create(data);
  return id;
};
exports.listForProduct = m.listForProduct;