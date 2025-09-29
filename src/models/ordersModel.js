const db = require('../db');

exports.createOrder = async ({ user_id, total, payment_method='paypal', payment_transaction_id=null, items=[] }) => {
  // create order, then order_items
  const r = await db.query('INSERT INTO orders (user_id,total,payment_method,payment_transaction_id) VALUES ($1,$2,$3,$4) RETURNING id', [user_id,total,payment_method,payment_transaction_id]);
  const orderId = r.rows[0].id;
  for (const it of items) {
    await db.query('INSERT INTO order_items (order_id,variant_id,quantity,price) VALUES ($1,$2,$3,$4)', [orderId, it.variant_id, it.quantity, it.price]);
  }
  return orderId;
};

exports.findById = async (id) => {
  const r = await db.query('SELECT o.*, COALESCE(json_agg(oi.*) FILTER (WHERE oi.id IS NOT NULL), ' + " '[]'::json) as items FROM orders o LEFT JOIN order_items oi ON oi.order_id=o.id WHERE o.id=$1 GROUP BY o.id", [id]);
  return r.rows[0];
};

exports.listForUser = async (userId) => {
  const r = await db.query('SELECT * FROM orders WHERE user_id=$1 ORDER BY id DESC', [userId]);
  return r.rows;
};