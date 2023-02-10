const express = require('express');
const router = express.Router();

const {
  createProduct,
  getAllProducts
} = require('../controllers/productController');

router.route('/').get(getAllProducts).post(createProduct);

module.exports = router;
