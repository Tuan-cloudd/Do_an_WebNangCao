import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import axios from 'axios';
import withRouter from '../utils/withRouter';
import './Mycart.css'; // Import file CSS

class Mycart extends Component {
  static contextType = MyContext;

  render() {
    const mycart = this.context.mycart.map((item, index) => {
      return (
        <tr key={item.product._id} className="cart-row">
          <td className="cell-no">{index + 1}</td>
          <td className="cell-img">
            <img
              src={"data:image/jpg;base64," + item.product.image}
              alt={item.product.name}
              className="product-thumb"
            />
          </td>
          <td className="cell-name">
            <span className="p-name">{item.product.name}</span>
            <small className="p-cate">{item.product.category?.name}</small>
          </td>
          <td className="cell-price">{item.product.price.toLocaleString()} đ</td>
          <td className="cell-qty">{item.quantity}</td>
          <td className="cell-amount">{(item.product.price * item.quantity).toLocaleString()} đ</td>
          <td className="cell-action">
            <button 
              className="btn-remove" 
              onClick={() => this.lnkRemoveClick(item.product._id)}
            >
              Remove
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div className="cart-container">
        <h2 className="cart-title">Your Sweet Basket</h2>

        <div className="cart-table-wrapper">
          <table className="cart-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.context.mycart.length > 0 ? (
                mycart
              ) : (
                <tr>
                  <td colSpan="7" className="empty-msg">Your cart is feeling light... add some pastries!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {this.context.mycart.length > 0 && (
          <div className="cart-summary">
            <div className="summary-details">
              <span className="total-label">Grand Total:</span>
              <span className="total-value">{CartUtil.getTotal(this.context.mycart).toLocaleString()} đ</span>
            </div>
            <button className="btn-checkout-main" onClick={() => this.lnkCheckoutClick()}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    );
  }

  // --- Handlers & API giữ nguyên logic của bạn ---
  lnkRemoveClick(id) {
    const mycart = [...this.context.mycart];
    const index = mycart.findIndex(x => x.product._id === id);
    if (index !== -1) {
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
    }
  }

  lnkCheckoutClick() {
    if (window.confirm('Confirm your order?')) {
      if (this.context.mycart.length > 0) {
        const total = CartUtil.getTotal(this.context.mycart);
        const items = this.context.mycart;
        const customer = this.context.customer;
        if (customer) {
          this.apiCheckout(total, items, customer);
        } else {
          this.props.navigate('/login');
        }
      } else {
        alert('Cart is empty');
      }
    }
  }

  apiCheckout(total, items, customer) {
    const body = { total, items, customer };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/customer/checkout', body, config).then((res) => {
      if (res.data) {
        alert('Order placed successfully! 🥐');
        this.context.setMycart([]);
        this.props.navigate('/home');
      } else {
        alert('Checkout failed. Please try again.');
      }
    });
  }
}

export default withRouter(Mycart);