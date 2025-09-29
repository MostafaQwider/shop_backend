const usersModel = require('../models/usersModel');

exports.create = async (data) => {
  const id = await usersModel.create(data);
  return usersModel.findById(id);
};

exports.findByEmail = usersModel.findByEmail;
exports.findById = usersModel.findById;

exports.list = usersModel.list;
exports.update = usersModel.update;
exports.remove = usersModel.remove;