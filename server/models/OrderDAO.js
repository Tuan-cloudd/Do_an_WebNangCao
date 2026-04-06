require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');

const OrderDAO = {
  async insert(order) {
    order._id = new mongoose.Types.ObjectId();
    return await Models.Order.create(order);
  },
  async selectByCustID(customerId) {
  const query = { 'customer._id': customerId };
  const orders = await Models.Order.find(query).exec();
  return orders;
},
async selectAll() {
  try {
    const orders = await Models.Order
      .find({})
      .populate('customer') // 🔥 PHẢI ở đây
      .sort({ cdate: -1 }) // sort giảm dần theo ngày tạo
      .exec();

    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
},
async update(_id, newStatus) {
  try {
    const newValues = { status: newStatus };

    const result = await Models.Order.findByIdAndUpdate(
      _id,
      newValues,
      { new: true }
    );

    return result;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}
};

module.exports = OrderDAO;