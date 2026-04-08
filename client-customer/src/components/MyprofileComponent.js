import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import './Myprofile.css'; // Import file CSS mới

class Myprofile extends Component {
  static contextType = MyContext;

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
    if (this.context.token === '') return <Navigate replace to="/login" />;

    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;

    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2 className="profile-title">My Profile</h2>
          <p className="profile-subtitle">Update your personal information below</p>

          <form className="profile-form">
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                value={txtUsername}
                onChange={(e) => this.setState({ txtUsername: e.target.value })}
                placeholder="Your username"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={txtPassword}
                onChange={(e) => this.setState({ txtPassword: e.target.value })}
                placeholder="********"
              />
            </div>

            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                value={txtName}
                onChange={(e) => this.setState({ txtName: e.target.value })}
                placeholder="Enter your name"
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={txtPhone}
                onChange={(e) => this.setState({ txtPhone: e.target.value })}
                placeholder="090..."
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                value={txtEmail}
                onChange={(e) => this.setState({ txtEmail: e.target.value })}
                placeholder="example@mail.com"
              />
            </div>

            <button 
              type="submit" 
              className="btn-update-profile" 
              onClick={(e) => this.btnUpdateClick(e)}
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (this.context.customer) {
      const { username, password, name, phone, email } = this.context.customer;
      this.setState({
        txtUsername: username,
        txtPassword: password,
        txtName: name,
        txtPhone: phone,
        txtEmail: email
      });
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;
    if (txtUsername && txtPassword && txtName && txtPhone && txtEmail) {
      const customer = {
        username: txtUsername,
        password: txtPassword,
        name: txtName,
        phone: txtPhone,
        email: txtEmail
      };
      this.apiPutCustomer(this.context.customer._id, customer);
    } else {
      alert('Please fill in all fields');
    }
  }

  apiPutCustomer(id, customer) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/customer/customers/' + id, customer, config).then((res) => {
      if (res.data) {
        alert('Profile updated successfully! ✨');
        this.context.setCustomer(res.data);
      } else {
        alert('Update failed, please try again.');
      }
    });
  }
}

export default Myprofile;