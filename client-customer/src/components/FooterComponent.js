import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="footer-container">

          {/* Logo + mô tả */}
          <div className="footer-col">
            <h2 className="footer-logo">Love Choux</h2>
            <p>
              Bánh Pháp cao cấp – giòn tan bên ngoài, mềm mịn bên trong.
              Mang đến trải nghiệm ngọt ngào mỗi ngày.
            </p>
          </div>

          {/* Menu */}
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="footer-col">
            <h4>Contact</h4>
            <p>Email: lovechoux@gmail.com</p>
            <p>Phone: 0123 456 789</p>
            <p>HCM City, Vietnam</p>
          </div>

        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© 2026 Love Choux. All rights reserved.</p>
        </div>
      </footer>
    );
  }
}

export default Footer;