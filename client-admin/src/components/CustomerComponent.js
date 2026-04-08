import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Customer extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      customers: []
    };
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  render() {
    const { customers } = this.state;

    const customerRows = customers.map((item) => (
      <tr key={item._id} style={styles.row}>
        <td>{item._id}</td>
        <td>{item.username}</td>
        <td>{item.password}</td>
        <td>{item.name}</td>
        <td>{item.phone}</td>
        <td>{item.email}</td>
        <td>
          <span style={styles.status(item.active)}>
            {item.active === 1 ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </td>
        <td>
          {item.active === 0 ? (
            <button
              style={styles.emailBtn}
              onClick={() => this.lnkEmailClick(item)}
            >
              EMAIL
            </button>
          ) : (
            <button
              style={styles.deactiveBtn}
              onClick={() => this.lnkDeactiveClick(item)}
            >
              DEACTIVE
            </button>
          )}
        </td>
      </tr>
    ));

    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>CUSTOMER LIST</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Password</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{customerRows}</tbody>
          </table>
        </div>
      </div>
    );
  }

  // ================= EVENT =================
  lnkDeactiveClick(item) {
    this.apiPutCustomerDeactive(item._id);
  }

  lnkEmailClick(item) {
    this.apiGetCustomerSendmail(item._id);
  }

  // ================= API =================
  apiGetCustomers() {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios.get('/api/admin/customers', config)
      .then((res) => {
        this.setState({ customers: res.data });
      });
  }

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

// 🎨 STYLE
const styles = {
  container: {
    padding: '20px',
    background: '#f4f6f9',
    minHeight: '100vh'
  },
  card: {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
  },
  title: {
    marginBottom: '15px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  row: {
    textAlign: 'center',
    borderBottom: '1px solid #ddd'
  },
  status: (active) => ({
    padding: '5px 10px',
    borderRadius: '6px',
    color: '#fff',
    background: active === 1 ? '#28a745' : '#6c757d'
  }),
  emailBtn: {
    background: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  deactiveBtn: {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default Customer;