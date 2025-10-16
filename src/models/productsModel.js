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
exports.listWithDetails = async (lang = 'en') => {
  const sql = `
    SELECT 
      p.id,
      p.base_price,
      p.created_at,

      -- اسم ووصف المنتج
      pt.name AS product_name,
      pt.description AS product_description,

      -- التصنيف مع الترجمة
      jsonb_build_object(
        'id', c.id,
        'name', ct.name,
        'parent', CASE WHEN pc.id IS NOT NULL THEN 
          jsonb_build_object('id', pc.id, 'name', pct.name)
        ELSE NULL END
      ) AS category,

      -- الصور
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', pi.id,
            'image_url', pi.image_url,
            'is_main', pi.is_main
          )
        ) FILTER (WHERE pi.id IS NOT NULL), '[]'
      ) AS images,

      -- الفاريانتس
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', pv.id,
            'price', pv.price,
            'stock', pv.stock,
            'size', jsonb_build_object('id', s.id, 'name', s.name),
            'color', jsonb_build_object('id', c2.id, 'name', c2.name)
          )
        ) FILTER (WHERE pv.id IS NOT NULL), '[]'
      ) AS variants

    FROM products p
    JOIN product_translations pt ON pt.product_id = p.id AND pt.language_code = $1
    JOIN categories c ON p.category_id = c.id
    JOIN category_translations ct ON ct.category_id = c.id AND ct.language_code = $1
    LEFT JOIN categories pc ON c.parent_id = pc.id
    LEFT JOIN category_translations pct ON pct.category_id = pc.id AND pct.language_code = $1

    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN product_variants pv ON pv.product_id = p.id
    LEFT JOIN colors c2 ON pv.color_id = c2.id
    LEFT JOIN sizes s ON pv.size_id = s.id

    GROUP BY p.id, pt.name, pt.description, c.id, ct.name, pc.id, pct.name
    ORDER BY p.id DESC
  `;
  const r = await db.query(sql, [lang]);
  return r.rows;
};

/*
[
  {
    "id": 1,
    "base_price": 20.00,
    "created_at": "2025-10-03T10:00:00",
    "product_name": "T-Shirt",
    "product_description": "High quality cotton t-shirt",
    "category": {
      "id": 3,
      "name": "Clothes",
      "parent": {
        "id": 1,
        "name": "Men"
      }
    },
    "images": [
      { "id": 10, "image_url": "https://example.com/images/tshirt1.png", "is_main": true },
      { "id": 11, "image_url": "https://example.com/images/tshirt2.png", "is_main": false }
    ],
    "variants": [
      {
        "id": 5,
        "price": 22.00,
        "stock": 50,
        "size": { "id": 1, "name": "M" },
        "color": { "id": 2, "name": "Red" }
      },
      {
        "id": 6,
        "price": 23.00,
        "stock": 30,
        "size": { "id": 2, "name": "L" },
        "color": { "id": 3, "name": "Blue" }
      }
    ]
  }
]


*/
