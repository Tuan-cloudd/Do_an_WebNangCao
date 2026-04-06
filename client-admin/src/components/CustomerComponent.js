import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Customer extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null
    };
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  render() {
    const { customers } = this.state;

    const customerRows = customers.map((item) => (
      <tr key={item._id} className="datatable">
        <td>{item._id}</td>
        <td>{item.username}</td>
        <td>{item.password}</td>
        <td>{item.name}</td>
        <td>{item.phone}</td>
        <td>{item.email}</td>
        <td>{item.active}</td>
        <td>
          {item.active === 0 ? (
            <span
              className="link"
              onClick={() => this.lnkEmailClick(item)}
            >
              EMAIL
            </span>
          ) : (
            <span
              className="link"
              onClick={() => this.lnkDeactiveClick(item)}
            >
              DEACTIVE
            </span>
          )}
        </td>
      </tr>
    ));

    return (
      <div className="align-center">
        <h2 className="text-center">CUSTOMER LIST</h2>

        <table className="datatable" border="1">
          <tbody>
            <tr className="datatable">
              <th>ID</th>
              <th>Username</th>
              <th>Password</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Active</th>
              <th>Action</th>
            </tr>

            {customerRows}

          </tbody>
        </table>
      </div>
    );
  }

  // ================= EVENT =================

  // DEACTIVE
  lnkDeactiveClick(item) {
    this.apiPutCustomerDeactive(item._id);
  }

  // SEND EMAIL
  lnkEmailClick(item) {
    this.apiGetCustomerSendmail(item._id);
  }

  // ================= API =================

  // GET CUSTOMERS
  apiGetCustomers() {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios.get('/api/admin/customers', config)
      .then((res) => {
        this.setState({ customers: res.data });
      });
  }

  // PUT DEACTIVE
  apiPutCustomerDeactive(id) {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios.put('/api/admin/customers/deactive/' + id, {}, config)
      .then((res) => {
        if (res.data) {
          alert('Deactive success!');
          this.apiGetCustomers();
        } else {
          alert('Failed!');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // GET SEND MAIL
  apiGetCustomerSendmail(id) {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios.get('/api/admin/customers/sendmail/' + id, config)
      .then((res) => {
        const result = res.data;
        alert(result.message);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

export default Customer;