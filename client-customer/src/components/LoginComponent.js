import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';
import './Login.css'; // nếu dùng file CSS riêng

class Login extends Component {
  static contextType = MyContext; // access global state

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: 'sonkk',
      txtPassword: '123'
    };
  }

  render() {
    const { txtUsername, txtPassword } = this.state;

    return (
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">CUSTOMER LOGIN</h2>

          <form className="login-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={txtUsername}
                onChange={(e) =>
                  this.setState({ txtUsername: e.target.value })
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={txtPassword}
                onChange={(e) =>
                  this.setState({ txtPassword: e.target.value })
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                onClick={(e) => this.btnLoginClick(e)}
                className="login-btn"
              >
                LOGIN
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ================= EVENT HANDLERS =================

  btnLoginClick(e) {
    e.preventDefault();

    const { txtUsername, txtPassword } = this.state;

    if (txtUsername && txtPassword) {
      const account = {
        username: txtUsername,
        password: txtPassword
      };

      this.apiLogin(account);
    } else {
      alert('Please input username and password');
    }
  }

  // ================= API =================

  apiLogin(account) {
    axios.post('/api/customer/login', account).then((res) => {
      const result = res.data;

      if (result.success === true) {
        // save to global state
        this.context.setToken(result.token);
        this.context.setCustomer(result.customer);

        // navigate to home
        this.props.navigate('/home');
      } else {
        alert(result.message);
      }
    });
  }
}

export default withRouter(Login);