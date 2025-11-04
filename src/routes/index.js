const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const usersRoutes = require('./users');
const categoriesRoutes = require('./categories');
const productsRoutes = require('./products');
const ordersRoutes = require('./orders');
const ratingsRoutes = require('./ratings');
const addressesRoutes = require('./addresses');
const paypalRoutes = require('./paypal'); // <- أضفنا هذا

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/categories', categoriesRoutes);
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/ratings', ratingsRoutes);
router.use('/addresses', addressesRoutes);
router.use('/paypal', paypalRoutes);


module.exports = router;