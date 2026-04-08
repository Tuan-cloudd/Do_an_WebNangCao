import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Menu extends Component {
  static contextType = MyContext;

  render() {
    return (
      <nav style={styles.navbar}>
        <div style={styles.container}>
          {/* Menu bên trái */}
          <div style={styles.leftSection}>
            <div style={styles.logo}>ADMIN PANEL</div>
            <ul style={styles.menuList}>
              <li style={styles.menuItem}><Link style={styles.link} to="/admin/home">Home</Link></li>
              <li style={styles.menuItem}><Link style={styles.link} to="/admin/category">Category</Link></li>
              <li style={styles.menuItem}><Link style={styles.link} to="/admin/product">Product</Link></li>
              <li style={styles.menuItem}><Link style={styles.link} to="/admin/order">Order</Link></li>
              <li style={styles.menuItem}><Link style={styles.link} to="/admin/customer">Customer</Link></li>
            </ul>
          </div>

          {/* Thông tin user bên phải */}
          <div style={styles.rightSection}>
            <span style={styles.userInfo}>
              Hi, <b style={styles.username}>{this.context.username}</b>
            </span>
            <Link to="/" style={styles.logoutBtn} onClick={() => this.lnkLogoutClick()}>
              Logout
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setUsername('');
  }
}
const styles = {
  navbar: {
    background: '#ffffff',
    borderBottom: '1px solid #e1e4e8',
    padding: '0 20px',
    height: '65px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontWeight: '800',
    fontSize: '18px',
    color: '#007bff',
    marginRight: '40px',
    letterSpacing: '1px',
  },
  menuList: {
    listStyle: 'none',
    display: 'flex',
    margin: 0,
    padding: 0,
  },
  menuItem: {
    marginRight: '25px',
  },
  link: {
    textDecoration: 'none',
    color: '#495057',
    fontWeight: '600',
    fontSize: '15px',
    transition: 'color 0.2s ease',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userInfo: {
    color: '#6c757d',
    fontSize: '14px',
  },
  username: {
    color: '#212529',
  },
  logoutBtn: {
    textDecoration: 'none',
    color: '#e74c3c',
    fontWeight: '700',
    fontSize: '14px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #e74c3c',
    transition: 'all 0.3s ease',
  },
};

export default Menu;