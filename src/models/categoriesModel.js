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
exports.listWithSubcategories = async (lang = 'en') => {
  const sql = `
    SELECT 
      c.id AS category_id,
      c.image_url,
      ct.name,
      COALESCE(
        json_agg(
          jsonb_build_object(
            'id', sc.id,
            'image_url', sc.image_url,
            'name', sct.name
          )
        ) FILTER (WHERE sc.id IS NOT NULL), '[]'
      ) AS subcategories
    FROM categories c
    JOIN category_translations ct 
      ON ct.category_id = c.id AND ct.language_code = $1
    LEFT JOIN categories sc ON sc.parent_id = c.id
    LEFT JOIN category_translations sct 
      ON sct.category_id = sc.id AND sct.language_code = $1
    WHERE c.parent_id IS NULL
    GROUP BY c.id, c.image_url, ct.name
    ORDER BY c.id
  `;
  const r = await db.query(sql, [lang]);
  return r.rows;
};

/*
[
  {
    "category_id": 1,
    "image_url": "/images/men.png",
    "name": "Men",
    "subcategories": [
      {
        "id": 2,
        "image_url": "/images/shirts.png",
        "name": "Shirts"
      },
      {
        "id": 5,
        "image_url": "/images/pants.png",
        "name": "Pants"
      }
    ]
  },
  {
    "category_id": 3,
    "image_url": "/images/clothes.png",
    "name": "Clothes",
    "subcategories": []
  }
]

*/