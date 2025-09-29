const db = require('../db');

exports.create = async ({ base_price, category_id }) => {
  const r = await db.query('INSERT INTO products (base_price,category_id) VALUES ($1,$2) RETURNING id', [base_price,category_id]);
  return r.rows[0].id;
};

exports.findById = async (id) => {
  const r = await db.query('SELECT p.*, COALESCE(json_agg(pi.*) FILTER (WHERE pi.id IS NOT NULL), ' + " '[]'::json) as images FROM products p LEFT JOIN product_images pi ON pi.product_id=p.id WHERE p.id=$1 GROUP BY p.id", [id]);
  return r.rows[0];
};

exports.list = async () => {
  const r = await db.query('SELECT * FROM products ORDER BY id DESC');
  return r.rows;
};

exports.update = async (id,data) => {
  const fields=[]; const values=[]; let idx=1;
  for (const k of ['base_price','category_id']) {
    if (data[k] !== undefined) { fields.push(k+'=$'+idx); values.push(data[k]); idx++; }
  }
  if (!fields.length) return this.findById(id);
  values.push(id);
  const sql = `UPDATE products SET ${fields.join(',')} WHERE id=$${idx} RETURNING id`;
  const r = await db.query(sql, values);
  return this.findById(r.rows[0].id);
};

exports.remove = async (id) => {
  await db.query('DELETE FROM products WHERE id=$1', [id]);
  return true;
};

// variants
exports.listVariants = async (productId) => {
  const r = await db.query('SELECT pv.*, c.name AS color_name, s.name AS size_name FROM product_variants pv LEFT JOIN colors c ON pv.color_id=c.id LEFT JOIN sizes s ON pv.size_id=s.id WHERE pv.product_id=$1', [productId]);
  return r.rows;
};

exports.createVariant = async (productId, { color_id, size_id, stock=0, price }) => {
  const r = await db.query('INSERT INTO product_variants (product_id,color_id,size_id,stock,price) VALUES ($1,$2,$3,$4,$5) RETURNING id', [productId,color_id,size_id,stock,price]);
  return r.rows[0].id;
};

// images
exports.listImages = async (productId) => {
  const r = await db.query('SELECT * FROM product_images WHERE product_id=$1 ORDER BY id', [productId]);
  return r.rows;
};
exports.createImage = async (productId, { image_url, is_main=false }) => {
  const r = await db.query('INSERT INTO product_images (product_id,image_url,is_main) VALUES ($1,$2,$3) RETURNING id', [productId,image_url,is_main]);
  return r.rows[0].id;
};