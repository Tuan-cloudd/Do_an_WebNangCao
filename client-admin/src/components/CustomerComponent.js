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
                <th style={styles.headerCell}>ID</th>
                <th style={styles.headerCell}>Username</th>
                <th style={styles.headerCell}>Password</th>
                <th style={styles.headerCell}>Name</th>
                <th style={styles.headerCell}>Phone</th>
                <th style={styles.headerCell}>Email</th>
                <th style={styles.headerCell}>Status</th>
                <th style={styles.headerCell}>Action</th>
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

/// 🎨 STYLE HIỆN ĐẠI (UPGRADED)
const styles = {
  container: {
    padding: '40px 20px',
    background: '#f0f2f5', // Nền xám nhạt sang trọng
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  },
  card: {
    background: '#ffffff',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e1e4e8'
  },
  title: {
    margin: '0 0 25px 0',
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    borderLeft: '5px solid #007bff',
    paddingLeft: '15px'
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 12px', // Tạo khoảng cách giữa các dòng cho thoáng
  },
  // Header của bảng
  headerCell: {
    textAlign: 'center',
    padding: '12px 15px',
    color: '#6c757d',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: '13px',
    borderBottom: '2px solid #f0f2f5'
  },
  row: {
    background: '#fff',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    textAlign: 'center'
  },
  // Cell dữ liệu
  cell: {
    padding: '15px',
    fontSize: '14px',
    color: '#495057',
    verticalAlign: 'middle',
    borderBottom: '1px solid #f8f9fa'
  },
  // Badge trạng thái kiểu "Pill"
  status: (active) => ({
    display: 'inline-block',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '0.5px',
    minWidth: '80px',
    background: active === 1 ? '#27ae60' : '#95a5a6' // Xanh lá cho Active, Xám cho Inactive
  }),
  // Nút gửi Email (Màu xanh dương đậm hơn)
  emailBtn: {
    background: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.3s',
    boxShadow: '0 4px 6px rgba(52, 152, 219, 0.2)'
  },
  // Nút khóa (Màu đỏ nhẹ nhàng)
  deactiveBtn: {
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.3s',
    boxShadow: '0 4px 6px rgba(231, 76, 60, 0.2)'
  }
};
export default Customer;