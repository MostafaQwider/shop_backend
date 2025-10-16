const db = require('../db');

//
// 🟢 إنشاء عنوان جديد
//
// 🔧 Input:
// {
//   user_id: 1,
//   street_name: "Main St 10",
//   additional_directions: "Near park", // اختياري
//   phone_number: "+49123456789",
//   address_type: "home",
//   building_number: 10, // اختياري
//   floor: 2, // اختياري
//   house_number: 5, // اختياري
//   company_number: null, // اختياري
//   company_name: null // اختياري
// }
//
// 🔙 Output:
// {
//   id: 1,
//   user_id: 1,
//   street_name: "Main St 10",
//   additional_directions: "Near park",
//   phone_number: "+49123456789",
//   address_type: "home",
//   building_number: 10,
//   floor: 2,
//   house_number: 5,
//   company_number: null,
//   company_name: null
// }
exports.createAddress = async ({
  user_id,
  street_name,
  additional_directions = null,
  phone_number,
  address_type,
  building_number = null,
  floor = null,
  house_number = null,
  company_number = null,
  company_name = null,
}) => {
  const r = await db.query(
    `INSERT INTO addresses
      (user_id, street_name, additional_directions, phone_number, address_type, building_number, floor, house_number, company_number, company_name)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      user_id,
      street_name,
      additional_directions,
      phone_number,
      address_type,
      building_number,
      floor,
      house_number,
      company_number,
      company_name,
    ]
  );

  return r.rows[0];
};

//
// 🟡 جلب عنوان بواسطة ID
//
// 🔧 Input:
//   id = 1
//
// 🔙 Output:
// {
//   id: 1,
//   user_id: 1,
//   street_name: "Main St 10",
//   additional_directions: "Near park",
//   phone_number: "+49123456789",
//   address_type: "home",
//   building_number: 10,
//   floor: 2,
//   house_number: 5,
//   company_number: null,
//   company_name: null
// }
exports.findById = async (id) => {
  const r = await db.query(`SELECT * FROM addresses WHERE id = $1`, [id]);
  return r.rows[0];
};

//
// 🟢 تحديث عنوان
//
// 🔧 Input:
//   id = 1
//   data = { street_name: "New St 15", floor: 3 }
//
// 🔙 Output:
// {
//   id: 1,
//   user_id: 1,
//   street_name: "New St 15",
//   additional_directions: "Near park",
//   phone_number: "+49123456789",
//   address_type: "home",
//   building_number: 10,
//   floor: 3,
//   house_number: 5,
//   company_number: null,
//   company_name: null
// }
exports.updateAddress = async (id, data) => {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const key in data) {
    fields.push(`${key}=$${idx}`);
    values.push(data[key]);
    idx++;
  }
  values.push(id);

  const r = await db.query(
    `UPDATE addresses SET ${fields.join(', ')} WHERE id=$${idx} RETURNING *`,
    values
  );

  return r.rows[0];
};

//
// 🔴 حذف عنوان
//
// 🔧 Input:
//   id = 1
//
// 🔙 Output:
//   true
//
exports.deleteAddress = async (id) => {
  await db.query(`DELETE FROM addresses WHERE id=$1`, [id]);
  return true;
};

//
// 🟣 جلب كل العناوين لمستخدم معين
//
// 🔧 Input:
//   user_id = 1
//
// 🔙 Output:
// [
//   {
//     id: 1,
//     user_id: 1,
//     street_name: "Main St 10",
//     additional_directions: "Near park",
//     phone_number: "+49123456789",
//     address_type: "home",
//     building_number: 10,
//     floor: 2,
//     house_number: 5,
//     company_number: null,
//     company_name: null
//   },
//   {
//     id: 2,
//     user_id: 1,
//     street_name: "Second St 5",
//     additional_directions: null,
//     phone_number: "+49111222333",
//     address_type: "office",
//     building_number: 5,
//     floor: null,
//     house_number: null,
//     company_number: 123,
//     company_name: "Tech Co"
//   }
// ]
//
exports.listForUser = async (user_id) => {
  const r = await db.query(
    `SELECT * FROM addresses WHERE user_id=$1 ORDER BY id DESC`,
    [user_id]
  );
  return r.rows;
};
