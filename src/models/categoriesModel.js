const db = require('../db');

exports.create = async ({ parent_id=null, image_url=null }) => {
  const r = await db.query('INSERT INTO categories (parent_id,image_url) VALUES ($1,$2) RETURNING id', [parent_id,image_url]);
  return r.rows[0].id;
};

exports.findById = async (id) => {
  const r = await db.query('SELECT * FROM categories WHERE id=$1', [id]);
  return r.rows[0];
};

exports.list = async () => {
  const r = await db.query('SELECT * FROM categories ORDER BY id');
  return r.rows;
};

exports.update = async (id,data) => {
  const fields = [];
  const values = [];
  let idx=1;
  for (const k of ['parent_id','image_url']) {
    if (data[k] !== undefined) { fields.push(k+'=$'+idx); values.push(data[k]); idx++; }
  }
  if (!fields.length) return this.findById(id);
  values.push(id);
  const sql = `UPDATE categories SET ${fields.join(',')} WHERE id=$${idx} RETURNING id`;
  const r = await db.query(sql, values);
  return this.findById(r.rows[0].id);
};

exports.remove = async (id) => {
  await db.query('DELETE FROM categories WHERE id=$1', [id]);
  return true;
};