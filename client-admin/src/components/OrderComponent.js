import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  trItemClick = (item) => {
    this.setState({ order: item });
  };

  lnkApproveClick = (id) => {
    this.apiPutOrderStatus(id, 'APPROVED');
  };

  lnkCancelClick = (id) => {
    this.apiPutOrderStatus(id, 'CANCELED');
  };

  apiGetOrders = async () => {
    try {
      const config = {
        headers: { 'x-access-token': this.context.token }
      };

      const res = await axios.get('/api/admin/orders', config);
      this.setState({ orders: res.data });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  apiPutOrderStatus = (id, status) => {
    const body = { status };
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios
      .put('/api/admin/orders/status/' + id, body, config)
      .then((res) => {
        if (res.data) this.apiGetOrders();
        else alert('Update failed!');
      })
      .catch((err) => {
        console.error(err);
        alert('Server error!');
      });
  };

  render() {
    const { orders, order } = this.state;

    const orderRows = orders.map((item) => (
      <tr
        key={item._id}
        style={styles.row}
        onClick={() => this.trItemClick(item)}
      >
        <td>{item._id}</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{item.customer?.name || 'N/A'}</td>
        <td>{item.customer?.phone || 'N/A'}</td>
        <td>{item.total}</td>
        <td>
          <span style={styles.status(item.status)}>
            {item.status}
          </span>
        </td>
        <td>
          {item.status === 'PENDING' && (
            <>
              <button
                style={styles.approveBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  this.lnkApproveClick(item._id);
                }}
              >
                APPROVE
              </button>
              <button
                style={styles.cancelBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  this.lnkCancelClick(item._id);
                }}
              >
                CANCEL
              </button>
            </>
          )}
        </td>
      </tr>
    ));

    const itemRows = order
      ? order.items.map((item, index) => (
          <tr key={item.product._id} style={styles.row}>
            <td>{index + 1}</td>
            <td>{item.product._id}</td>
            <td>{item.product.name}</td>
            <td>
              <img
                src={`data:image/jpg;base64,${item.product.image}`}
                alt=""
                style={styles.image}
              />
            </td>
            <td>{item.product.price}</td>
            <td>{item.quantity}</td>
            <td>{item.product.price * item.quantity}</td>
          </tr>
        ))
      : null;

    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>ORDER LIST</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{orderRows}</tbody>
          </table>
        </div>

        {order && (
          <div style={styles.card}>
            <h2 style={styles.title}>ORDER DETAIL</h2>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>{itemRows}</tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

// 🎨 STYLE
const styles = {
  container: {
    padding: '40px 20px',
    background: '#f0f2f5', // Màu nền xám nhạt hiện đại
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  },
  card: {
    background: '#ffffff',
    padding: '30px',
    marginBottom: '30px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e1e4e8'
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    borderLeft: '5px solid #007bff',
    paddingLeft: '15px'
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 10px', // Tạo khoảng cách giữa các dòng
  },
  // Chỉnh lại header của table
  headerCell: {
    textAlign: 'left',
    padding: '12px 15px',
    color: '#6c757d',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: '13px',
    borderBottom: '2px solid #f0f2f5'
  },
  row: {
    cursor: 'pointer',
    background: '#fff',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
  },
  // Thêm style cho từng cell để đồng bộ
  cell: {
    padding: '15px',
    fontSize: '15px',
    color: '#495057',
    verticalAlign: 'middle'
  },
  image: {
    width: '70px',
    height: '70px',
    borderRadius: '12px',
    objectFit: 'cover',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  approveBtn: {
    background: '#2ecc71',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    marginRight: '8px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.3s',
    boxShadow: '0 4px 6px rgba(46, 204, 113, 0.2)'
  },
  cancelBtn: {
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.3s',
    boxShadow: '0 4px 6px rgba(231, 76, 60, 0.2)'
  },
  status: (status) => ({
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px', // Bo tròn kiểu viên thuốc
    fontSize: '12px',
    fontWeight: '700',
    textAlign: 'center',
    minWidth: '90px',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background:
      status === 'APPROVED'
        ? '#27ae60'
        : status === 'CANCELED'
        ? '#c0392b'
        : '#f39c12'
  })
};

export default Order;