import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';
import '../styles/Login.css';

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: ''
    };
  }

  render() {
    const { txtUsername, txtPassword } = this.state;

    return (
      <div className="login-page-wrapper">
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-brand">Welcome Back</h2>
            <p className="login-subtext">Please enter your details to sign in</p>
          </div>

          <form className="login-form-content" onSubmit={(e) => this.btnLoginClick(e)}>
            <div className="input-box">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={txtUsername}
                onChange={(e) => this.setState({ txtUsername: e.target.value })}
                className="custom-input"
              />
            </div>

            <div className="input-box">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={txtPassword}
                onChange={(e) => this.setState({ txtPassword: e.target.value })}
                className="custom-input"
              />
            </div>

            <button type="submit" className="login-submit-btn">
              Sign In
            </button>
          </form>

          <div className="login-footer">
            <span>New member? </span>
            <a href="/signup" className="signup-redirect">Create an account</a>
          </div>
        </div>
      </div>
    );
  }

  btnLoginClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword } = this.state;
    if (txtUsername && txtPassword) {
      const account = { username: txtUsername, password: txtPassword };
      this.apiLogin(account);
    } else {
      alert('Please input username and password');
    }
  }

  apiLogin(account) {
    axios.post('/api/customer/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setCustomer(result.customer);
        this.props.navigate('/home');
      } else {
        alert(result.message);
      }
    });
  }
}

export default withRouter(Login);