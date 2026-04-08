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
    padding: '20px',
    background: '#f5f7fa',
    minHeight: '100vh'
  },
  card: {
    background: '#fff',
    padding: '20px',
    marginBottom: '20px',
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
    cursor: 'pointer',
    transition: '0.2s'
  },
  image: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover'
  },
  approveBtn: {
    background: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    marginRight: '5px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  cancelBtn: {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  status: (status) => ({
    padding: '4px 8px',
    borderRadius: '6px',
    color: '#fff',
    background:
      status === 'APPROVED'
        ? '#28a745'
        : status === 'CANCELED'
        ? '#dc3545'
        : '#ffc107'
  })
};

export default Order;