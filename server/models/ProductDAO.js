// Khởi tạo kết nối MongoDB
require('../utils/MongooseUtil');

// Import các Model
const Models = require('./Models');

// Data Access Object cho Product
const ProductDAO = {
  /**
   * Lấy toàn bộ danh sách sản phẩm
   * @returns {Promise<Array>}
   */
  async selectAll() {
    const query = {}; // không điều kiện → lấy tất cả
    const products = await Models.Product.find(query).exec();
    return products;
  },
   async insert(product) {
    const mongoose = require('mongoose');
    product._id = new mongoose.Types.ObjectId();
    const result = await Models.Product.create(product);
    return result;
    },

    async selectByID(_id) {
  // Tìm product theo ID
  const product = await Models.Product.findById(_id).exec();
  return product;
},

async update(product) {
  // Các trường cần cập nhật
  const newValues = {
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category
  };

  // Cập nhật product và trả về bản ghi mới
  const result = await Models.Product.findByIdAndUpdate(
    product._id,
    newValues,
    { new: true }
  );

  return result;
},
 async delete(_id) {
  const result = await Models.Product.findByIdAndDelete(_id);
  return result;
  },

  async selectByID(_id) {
  const product = await Models.Product.findById(_id).exec();
  return product;
},

async selectTopNew(top) {
  const query = {};
  const mysort = { cdate: -1 }; // descending

  const products = await Models.Product
    .find(query)
    .sort(mysort)
    .limit(top)
    .exec();

  return products;
},

async selectTopHot(top) {
  const items = await Models.Order.aggregate([
    { $match: { status: 'APPROVED' } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product._id',
        sum: { $sum: '$items.quantity' }
      }
    },
    { $sort: { sum: -1 } }, // descending
    { $limit: top }
  ]).exec();

  var products = [];

  for (const item of items) {
    const product = await ProductDAO.selectByID(item._id);
    products.push(product);
  }

  return products;
},
async selectByCatID(_cid) {
  const query = { 'category._id': _cid };   // điều kiện tìm sản phẩm theo category id
  const products = await Models.Product.find(query).exec();  // truy vấn database
  return products;   // trả về danh sách sản phẩm
},
async selectByKeyword(keyword) {
  const query = { name: { $regex: new RegExp(keyword, "i") } };
  const products = await Models.Product.find(query).exec();
  return products;
}

};

module.exports = ProductDAO;
