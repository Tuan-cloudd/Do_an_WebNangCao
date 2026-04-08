import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import './Inform.css'; // Tạo file CSS riêng

class Inform extends Component {
  static contextType = MyContext;

  render() {
    const { token, customer, mycart } = this.context;

    return (
      <nav className="inform-navbar">
        <div className="inform-container">
          
          {/* LEFT: Auth Links & Profile */}
          <div className="auth-section">
            {token === '' ? (
              <div className="auth-group">
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/signup" className="nav-link btn-signup-small">Sign Up</Link>
                <Link to="/active" className="nav-link">Active</Link>
              </div>
            ) : (
              <div className="auth-group">
                <span className="welcome-text">Hello, <b>{customer.name}</b></span>
                <Link to="/myprofile" className="nav-link">My Profile</Link>
                <Link to="/myorders" className="nav-link">My Orders</Link>
                <Link to="/home" className="nav-link logout-link" onClick={() => this.lnkLogoutClick()}>
                  Logout
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT: Cart */}
          <div className="cart-section">
            <Link to="/mycart" className="cart-link">
              <div className="cart-icon-wrapper">
                <span className="cart-label">My Cart</span>
                <span className="cart-badge">{mycart.length}</span>
              </div>
            </Link>
          </div>

        </div>
      </nav>
    );
  }

  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMycart([]);
  }
}

export default Inform;