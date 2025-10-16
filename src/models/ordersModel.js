const db = require('../db');

//
// 🟢 إنشاء طلب جديد
//
// 🧩 Input:
// {
//   user_id: 1,
//   address_id: 2,
//   total: 99.99,
//   payment_method: 'paypal',
//   payment_transaction_id: 'abc123',
//   status: 'pending',
//   expected_delivery_time: '2 days',
//   items: [
//     { product_id: 1, color_id: null, size_id: null, quantity: 2, price: 49.99 }
//   ]
// }
//
// 🔙 Output:
// {
//   orderId: 15
// }
//
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
    `INSERT INTO orders 
      (user_id, address_id, total, payment_method, payment_transaction_id, status, expected_delivery_time)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
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
      `INSERT INTO order_items 
        (order_id, product_id, color_id, size_id, quantity, price)
       VALUES ($1, $2, $3, $4, $5, $6)`,
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

//
// 🟡 جلب طلب بواسطة ID مع تفاصيل المنتجات والعنوان والمستخدم
//
// 🔙 Output:
// {
//   id: 15,
//   user: { id: 1, name: "Ali", email: "ali@example.com", role: "customer" },
//   address: { ... },
//   total: 99.99,
//   payment_method: "paypal",
//   status: "pending",
//   expected_delivery_time: "2 days",
//   items: [ ... ]
// }
//
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
      json_build_object(
        'id', a.id,
        'streetName', a.street_name,
        'additionalDirections', a.additional_directions,
        'phoneNumber', a.phone_number,
        'addressType', a.address_type,
        'buildingNumber', a.building_number,
        'floor', a.floor,
        'houseNumber', a.house_number,
        'companyNumber', a.company_number,
        'companyName', a.company_name
      ) AS address,
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
    LEFT JOIN addresses a ON a.id = o.address_id
    LEFT JOIN users u ON u.id = o.user_id
    WHERE o.id = $1
    GROUP BY o.id, a.id, u.id
    `,
    [id]
  );

  return r.rows[0];
};

//
// 🟢 جلب جميع الطلبات (للوحة التحكم) مع معلومات المستخدم والعنوان والعناصر
//
// 🔙 Output:
// [
//   {
//     id: 15,
//     user: { id: 1, name: "Ali", email: "ali@example.com", role: "customer" },
//     address: { id: 2, streetName: "Main St 10", phoneNumber: "+49..." },
//     total: 99.99,
//     payment_method: "paypal",
//     payment_transaction_id: "abc123",
//     status: "pending",
//     expected_delivery_time: "2 days",
//     items: [
//       { id: 1, product_id: 3, color_id: 2, size_id: 1, quantity: 2, price: 49.99 },
//       ...
//     ]
//   },
//   ...
// ]
//
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
      json_build_object(
        'id', a.id,
        'streetName', a.street_name,
        'additionalDirections', a.additional_directions,
        'phoneNumber', a.phone_number,
        'addressType', a.address_type,
        'buildingNumber', a.building_number,
        'floor', a.floor,
        'houseNumber', a.house_number,
        'companyNumber', a.company_number,
        'companyName', a.company_name
      ) AS address,
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
    LEFT JOIN addresses a ON a.id = o.address_id
    LEFT JOIN users u ON u.id = o.user_id
    GROUP BY o.id, a.id, u.id
    ORDER BY o.id DESC
  `);

  return r.rows;
};


//
// 🟣 جلب الطلبات الخاصة بمستخدم معين مع معلومات العنوان والعناصر
//
// 🔙 Output:
// [
//   {
//     id: 15,
//     total: 99.99,
//     payment_method: "paypal",
//     payment_transaction_id: "abc123",
//     status: "pending",
//     expected_delivery_time: "2 days",
//     address: { ... },
//     items: [
//       { id: 1, product_id: 3, color_id: 2, size_id: 1, quantity: 2, price: 49.99 },
//       ...
//     ]
//   },
//   ...
// ]
//
exports.listForUser = async (userId) => {
  const r = await db.query(
    `
    SELECT 
      o.*,
      json_build_object(
        'id', a.id,
        'streetName', a.street_name,
        'additionalDirections', a.additional_directions,
        'phoneNumber', a.phone_number,
        'addressType', a.address_type,
        'buildingNumber', a.building_number,
        'floor', a.floor,
        'houseNumber', a.house_number,
        'companyNumber', a.company_number,
        'companyName', a.company_name
      ) AS address,
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
    LEFT JOIN addresses a ON a.id = o.address_id
    WHERE o.user_id = $1
    GROUP BY o.id, a.id
    ORDER BY o.id DESC
    `,
    [userId]
  );

  return r.rows;
};
