const db = require('../db');

exports.create = async ({ name, email, password, role = 'customer' }) => {
  const sql = `INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING id`;
  const r = await db.query(sql, [name, email, password, role]);
  return r.rows[0].id;
};

exports.findByEmail = async (email) => {
  const r = await db.query('SELECT * FROM users WHERE email=$1', [email]);
  return r.rows[0];
};

exports.findById = async (id) => {
  const r = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id=$1', [id]);
  return r.rows[0];
};

exports.list = async () => {
  const r = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC');
  return r.rows;
};

exports.update = async (id, data) => {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const k of ['name', 'email', 'password', 'role']) { // حذف address من هنا
    if (data[k] !== undefined) {
      fields.push(k + '=$' + idx);
      values.push(data[k]);
      idx++;
    }
  }
  if (!fields.length) return this.findById(id);
  const sql = `UPDATE users SET ${fields.join(',')} WHERE id=$${idx} RETURNING id`;
  values.push(id);
  const r = await db.query(sql, values);
  return this.findById(r.rows[0].id);
};

exports.remove = async (id) => {
  await db.query('DELETE FROM users WHERE id=$1', [id]);
  return true;
};
