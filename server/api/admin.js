const express = require('express');
const router = express.Router();

// utils
const JwtUtil = require('../utils/JwtUtil');

// daos
const CategoryDAO = require('../models/CategoryDAO');
const AdminDAO = require('../models/AdminDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');

// ======================= CATEGORY =======================

// GET ALL CATEGORIES
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  try {
    const categories = await CategoryDAO.selectAll();
    res.json(categories);
  } catch (error) {
    console.error('Error in GET /categories:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// INSERT CATEGORY
router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  try {
    const name = req.body.name;
    const category = { name: name };
    const result = await CategoryDAO.insert(category);
    res.json(result);
  } catch (error) {
    console.error('Error in POST /categories:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// update category
router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const category = { _id: _id, name: name };
  const result = await CategoryDAO.update(category);
  res.json(result);
 });
// DELETE CATEGORY

router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CategoryDAO.delete(_id);
  res.json(result);
});
// ======================= LOGIN =======================

router.post('/login', async function (req, res) {
  try {
    const { username, password } = req.body;

    if (username && password) {
      const admin = await AdminDAO.selectByUsernameAndPassword(username, password);

      if (admin) {
        const token = JwtUtil.genToken(admin.username, admin.password);
        res.json({ success: true, message: 'Authentication successful', token: token });
      } else {
        res.json({ success: false, message: 'Incorrect username or password' });
      }
    } else {
      res.json({ success: false, message: 'Please input username and password' });
    }
  } catch (error) {
    console.error('Error in POST /login:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ======================= CHECK TOKEN =======================

router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token: token });
});

// ==========================product========================
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  // Lấy toàn bộ sản phẩm
  let products = await ProductDAO.selectAll();

  // Phân trang
  const pageSize = 4;
  const totalPages = Math.ceil(products.length / pageSize);

  let currentPage = 1;
  if (req.query.page) {
    currentPage = parseInt(req.query.page); // /products?page=xxx
  }

  const offset = (currentPage - 1) * pageSize;
  products = products.slice(offset, offset + pageSize);

  // Trả kết quả
  const result = {
    products: products,
    noPages: totalPages,
    curPage: currentPage
  };

  res.json(result);
});

// ========================Them product====================
router.post('/products', JwtUtil.checkToken, async function (req, res) {
  // Lấy dữ liệu từ request
  const { name, price, category: cid, image } = req.body;

  // Thời điểm tạo (milliseconds)
  const createdTime = Date.now();

  // Lấy thông tin category
  const category = await CategoryDAO.selectByID(cid);

  // Tạo object product
  const product = {
    name: name,
    price: price,
    image: image,
    cdate: createdTime,
    category: category
  };

  // Lưu vào database
  const result = await ProductDAO.insert(product);

  // Trả kết quả
  res.json(result);
});
// ==============cap nhat===============
// product
router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
  

  // Lấy dữ liệu từ request
  const _id = req.params.id;
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;

  // Thời điểm cập nhật (milliseconds)
  const updatedTime = Date.now();

  // Lấy thông tin category
  const category = await CategoryDAO.selectByID(cid);

  // Tạo object product để cập nhật
  const product = {
    _id: _id,
    name: name,
    price: price,
    image: image,
    cdate: updatedTime,
    category: category
  };

  // Cập nhật product
  const result = await ProductDAO.update(product);

  // Trả kết quả
  res.json(result);
});

// product
router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});
// order
router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  try {
    const orders = await OrderDAO.selectAll();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const newStatus = req.body.status;

    const validStatus = ['PENDING', 'APPROVED', 'CANCELED'];
    if (!validStatus.includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const result = await OrderDAO.update(_id, newStatus);

    res.json(result);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
 // daos
const CustomerDAO = require('../models/CustomerDAO');


// customer
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});

// order
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;

  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});
// customer
router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 0);
  res.json(result);
});
 // utils
const EmailUtil = require('../utils/EmailUtil');

// customer
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;

  const cust = await CustomerDAO.selectByID(_id);

  if (cust) {
    const send = await EmailUtil.send(cust.email, cust._id, cust.token);

    if (send) {
      res.json({ success: true, message: 'Please check email' });
    } else {
      res.json({ success: false, message: 'Email failure' });
    }

  } else {
    res.json({ success: false, message: 'Not exists customer' });
  }
});


module.exports = router;
