import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

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
      const customerId = this.context.customer._id;
      this.apiGetOrdersByCustID(customerId);
    }
  }

  // ================= EVENT HANDLERS =================
  trItemClick = (order) => {
    this.setState({ order });
  };

  // ================= API =================
  apiGetOrdersByCustID(customerId) {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios
      .get(`/api/customer/orders/customer/${customerId}`, config)
      .then((res) => {
        this.setState({ orders: res.data });
      });
  }

  render() {
    // chưa login
    if (this.context.token === '') {
      return <Navigate replace to="/login" />;
    }

    const { orders, order } = this.state;

    // danh sách orders
    const orderRows = orders.map((item) => (
      <tr
        key={item._id}
        className="datatable"
        onClick={() => this.trItemClick(item)}
      >
        <td>{item._id}</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{item.customer.name}</td>
        <td>{item.customer.phone}</td>
        <td>{item.total}</td>
        <td>{item.status}</td>
      </tr>
    ));

    // chi tiết order
    const itemRows = order
      ? order.items.map((item, index) => (
          <tr key={item.product._id} className="datatable">
            <td>{index + 1}</td>
            <td>{item.product._id}</td>
            <td>{item.product.name}</td>
            <td>
              <img
                src={`data:image/jpg;base64,${item.product.image}`}
                width="70"
                height="70"
                alt=""
              />
            </td>
            <td>{item.product.price}</td>
            <td>{item.quantity}</td>
            <td>{item.product.price * item.quantity}</td>
          </tr>
        ))
      : null;

    return (
      <div>
        {/* ORDER LIST */}
        <div className="align-center">
          <h2 className="text-center">ORDER LIST</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Creation date</th>
                <th>Cust.name</th>
                <th>Cust.phone</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
              {orderRows}
            </tbody>
          </table>
        </div>

        {/* ORDER DETAIL */}
        {order ? (
          <div className="align-center">
            <h2 className="text-center">ORDER DETAIL</h2>
            <table className="datatable" border="1">
              <tbody>
                <tr className="datatable">
                  <th>No.</th>
                  <th>Prod.ID</th>
                  <th>Prod.name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
                {itemRows}
              </tbody>
            </table>
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default Myorders;