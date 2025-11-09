const db = require('../db');

// 🟢 إنشاء طلب جديد
exports.createOrder = async ({
  user_id,
  address_id,
  total,
  payment_method = 'paypal',
  payment_transaction_id = null,
  status = 'pending',
  expected_delivery_time = 'Not Assigned',
  items = [],
}) => {
  const r = await db.query(
    `
    INSERT INTO orders
      (user_id, address_id, total, payment_method, payment_transaction_id, status, expected_delivery_time)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
    `,
    [
      user_id,
      address_id,
      total,
      payment_method,
      payment_transaction_id,
      status,
      expected_delivery_time,
    ]
  );

  const orderId = r.rows[0].id;

  for (const it of items) {
    await db.query(
      `
      INSERT INTO order_items
        (order_id, product_id, color_id, size_id, quantity, price)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        orderId,
        it.product_id,
        it.color_id || null,
        it.size_id || null,
        it.quantity,
        it.price,
      ]
    );
  }

  return { orderId };
};

// 🟡 جلب طلب بواسطة ID مع user و address_id فقط
exports.findById = async (id) => {
  const r = await db.query(
    `
    SELECT
      o.*,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email,
        'role', u.role
      ) AS user,
      o.address_id,
      COALESCE(
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'color_id', oi.color_id,
            'size_id', oi.size_id,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'::json
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    LEFT JOIN users u ON u.id = o.user_id
    WHERE o.id = $1
    GROUP BY o.id, u.id
    `,
    [id]
  );

  return r.rows[0];
};

// 🟢 جلب جميع الطلبات مع user و address_id فقط
exports.findAll = async () => {
  const r = await db.query(`
    SELECT
      o.*,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email,
        'role', u.role
      ) AS user,
      o.address_id,
      COALESCE(
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'color_id', oi.color_id,
            'size_id', oi.size_id,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'::json
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    LEFT JOIN users u ON u.id = o.user_id
    GROUP BY o.id, u.id
    ORDER BY o.id DESC
  `);

  return r.rows;
};

// 🟣 جلب الطلبات الخاصة بمستخدم معين مع address_id فقط
exports.listForUser = async (userId) => {
  const r = await db.query(
    `
    SELECT
      o.*,
      o.address_id,
      COALESCE(
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'color_id', oi.color_id,
            'size_id', oi.size_id,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'::json
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.id DESC
    `,
    [userId]
  );

  return r.rows;
};

// 🟠 تحديث طلب
exports.update = async (id, fields) => {
  // نبني قائمة الأعمدة التي سيتم تحديثها ديناميكياً
  const allowedFields = [
    'status',
    'payment_method',
    'payment_transaction_id',
    'expected_delivery_time',
    'total',
    'address_id'
  ];

  // فلترة الحقول المدخلة بناءً على المسموح به
  const keys = Object.keys(fields).filter((key) => allowedFields.includes(key));
  if (keys.length === 0) {
    throw new Error('No valid fields to update');
  }

  // بناء جملة SET للديناميكية
  const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(', ');
  const values = keys.map((key) => fields[key]);

  const query = `
    UPDATE orders
    SET ${setClause}
    WHERE id = $1
    RETURNING *
  `;

  const r = await db.query(query, [id, ...values]);
  return r.rows[0];
};
