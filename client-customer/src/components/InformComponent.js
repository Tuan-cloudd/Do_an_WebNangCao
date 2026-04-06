import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Inform extends Component {
  static contextType = MyContext; // using this.context to access global state

  render() {
    const { token, customer } = this.context;

    return (
      <div className="border-bottom">

        {/* LEFT MENU */}
        <div className="float-left">
          {token === '' ? (
            <div>
              <Link to="/login">Login</Link> |{' '}
              <Link to="/signup">Sign-up</Link> |{' '}
              <Link to="/active">Active</Link>
              
            </div>
          ) : (
            <div>
              Hello <b>{customer.name}</b> |{' '}
              <Link to="/home" onClick={() => this.lnkLogoutClick()}>
                Logout
              </Link>{' '}
              | <Link to="/myprofile">My profile</Link> | <Link to='/myorders'>My orders</Link>
            </div>
          )}
        </div>

        {/* RIGHT MENU */}
        <div className="float-right">
          <Link to='/mycart'>My cart</Link> have <b>{this.context.mycart.length}</b> items
        </div>

        <div className="float-clear" />
      </div>
    );
  }

  // ================= EVENT HANDLERS =================

  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMycart([])
  }
}

export default Inform;