const db = require('../db');
exports.create = async ({ user_id, product_id, rating=null, comment=null }) => {
  const r = await db.query('INSERT INTO ratings (user_id,product_id,rating,comment) VALUES ($1,$2,$3,$4) RETURNING id', [user_id,product_id,rating,comment]);
  return r.rows[0].id;
};

exports.listForProduct = async (productId) => {
  const r = await db.query('SELECT r.*, u.name as user_name FROM ratings r LEFT JOIN users u ON r.user_id=u.id WHERE r.product_id=$1 ORDER BY r.id DESC', [productId]);
  return r.rows;
};