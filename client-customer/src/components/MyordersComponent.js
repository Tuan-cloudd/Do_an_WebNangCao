import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import './Myorders.css'; // Đảm bảo bạn tạo file CSS này

class Myorders extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }

  componentDidMount() {
    if (this.context.customer) {
      this.apiGetOrdersByCustID(this.context.customer._id);
    }
  }

  trItemClick = (order) => {
    this.setState({ order });
  };

  apiGetOrdersByCustID(customerId) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get(`/api/customer/orders/customer/${customerId}`, config).then((res) => {
      this.setState({ orders: res.data });
    });
  }

  render() {
    if (this.context.token === '') return <Navigate replace to="/login" />;
    const { orders, order } = this.state;

    const orderRows = orders.map((item) => (
      <tr key={item._id} className={`order-row ${order?._id === item._id ? 'active' : ''}`} onClick={() => this.trItemClick(item)}>
        <td><span className="order-id-badge">{item._id.substring(item._id.length - 6)}</span></td>
        <td>{new Date(item.cdate).toLocaleDateString()}</td>
        <td className="text-bold">{item.total.toLocaleString()} đ</td>
        <td>
          <span className={`status-pill ${item.status.toLowerCase()}`}>
            {item.status}
          </span>
        </td>
      </tr>
    ));

    const itemRows = order?.items.map((item, index) => (
      <tr key={item.product._id} className="detail-row">
        <td>{index + 1}</td>
        <td>
          <div className="product-cell">
            <img src={`data:image/jpg;base64,${item.product.image}`} alt="" className="prod-img-mini" />
            <span>{item.product.name}</span>
          </div>
        </td>
        <td>{item.product.price.toLocaleString()}</td>
        <td>x{item.quantity}</td>
        <td className="text-bold">{(item.product.price * item.quantity).toLocaleString()}</td>
      </tr>
    ));

    return (
      <div className="orders-container">
        <div className="orders-layout">
          {/* CỘT TRÁI: DANH SÁCH */}
          <div className="orders-list-section">
            <h2 className="section-title">Purchase History</h2>
            <div className="table-card">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID (Short)</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>{orderRows}</tbody>
              </table>
            </div>
          </div>

          {/* CỘT PHẢI: CHI TIẾT */}
          <div className="orders-detail-section">
            <h2 className="section-title">Order Detail</h2>
            {order ? (
              <div className="detail-card">
                <div className="detail-header">
                  <p><strong>Customer:</strong> {order.customer.name}</p>
                  <p><strong>Phone:</strong> {order.customer.phone}</p>
                </div>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>{itemRows}</tbody>
                </table>
                <div className="detail-footer">
                   <span>Grand Total:</span>
                   <span className="final-price">{order.total.toLocaleString()} đ</span>
                </div>
              </div>
            ) : (
              <div className="empty-detail">
                <p>Select an order on the left to see details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Myorders;