const model = require('../models/addressesModel');

exports.createAddress = (data) => model.createAddress(data);
exports.findById = (id) => model.findById(id);
exports.updateAddress = (id, data) => model.updateAddress(id, data);
exports.deleteAddress = (id) => model.deleteAddress(id);
exports.listForUser = (user_id) => model.listForUser(user_id);
