import axios from 'axios';
import React, { Component } from 'react';
import '../styles/Signup.css'; 

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: ''
    };
  }

  render() {
    return (
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h2 className="signup-title">Join Us</h2>
            <p className="signup-subtitle">Create an account to enjoy our sweet treats!</p>
          </div>

          <form className="signup-form">
            <div className="input-field">
              <label>Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                value={this.state.txtUsername}
                onChange={(e) => this.setState({ txtUsername: e.target.value })}
              />
            </div>

            <div className="input-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={this.state.txtPassword}
                onChange={(e) => this.setState({ txtPassword: e.target.value })}
              />
            </div>

            <div className="input-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={this.state.txtName}
                onChange={(e) => this.setState({ txtName: e.target.value })}
              />
            </div>

            <div className="input-field">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="e.g., 0901234567"
                value={this.state.txtPhone}
                onChange={(e) => this.setState({ txtPhone: e.target.value })}
              />
            </div>

            <div className="input-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="example@mail.com"
                value={this.state.txtEmail}
                onChange={(e) => this.setState({ txtEmail: e.target.value })}
              />
            </div>

            <button 
              type="submit" 
              className="btn-signup-submit"
              onClick={(e) => this.btnSignupClick(e)}
            >
              Create Account
            </button>
          </form>
          
          <div className="signup-footer">
            <p>Already have an account? <a href="/login">Log in</a></p>
          </div>
        </div>
      </div>
    );
  }

  // --- Logic API giữ nguyên ---
  btnSignupClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;

    if (txtUsername && txtPassword && txtName && txtPhone && txtEmail) {
      const account = {
        username: txtUsername,
        password: txtPassword,
        name: txtName,
        phone: txtPhone,
        email: txtEmail
      };
      this.apiSignup(account);
    } else {
      alert('Please fill in all information fields.');
    }
  }

  apiSignup(account) {
    axios.post('/api/customer/signup', account).then((res) => {
      const result = res.data;
      alert(result.message);
    });
  }
}

export default Signup;