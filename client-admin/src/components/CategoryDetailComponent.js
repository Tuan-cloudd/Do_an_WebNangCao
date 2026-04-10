import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class CategoryDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: ''
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Category Details</h2>
          <p style={styles.subtitle}>Quản lý thông tin danh mục sản phẩm</p>
        </div>

        <form style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Category ID</label>
            <input
              type="text"
              value={this.state.txtID}
              onChange={(e) => this.setState({ txtID: e.target.value })}
              readOnly={true}
              style={styles.inputReadOnly}
              placeholder="Auto-generated ID"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Category Name</label>
            <input
              type="text"
              value={this.state.txtName}
              onChange={(e) => this.setState({ txtName: e.target.value })}
              style={styles.input}
              placeholder="Enter category name..."
            />
          </div>

          <div style={styles.buttonContainer}>
            <button style={styles.addBtn} onClick={(e) => this.btnAddClick(e)}>
              Add New
            </button>
            <button style={styles.updateBtn} onClick={(e) => this.btnUpdateClick(e)}>
              Update
            </button>
            <div style={styles.divider}></div>
            <button style={styles.deleteBtn} onClick={(e) => this.btnDeleteClick(e)}>
              Delete
            </button>
          </div>
        </form>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name
      });
    }
  }

  // ================= EVENT HANDLERS =================
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    if (name) this.apiPostCategory({ name });
    else alert('Please input name');
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtID, txtName } = this.state;
    if (txtID && txtName) this.apiPutCategory(txtID, { name: txtName });
    else alert('Please input id and name');
  }

  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('ARE YOU SURE?')) {
      const id = this.state.txtID;
      if (id) this.apiDeleteCategory(id);
      else alert('Please input id');
    }
  }

  // ================= APIS =================
  apiPostCategory(cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/categories', cate, config)
      .then((res) => {
        if (res.data) {
          alert('Add category successfully!');
          this.apiGetCategories();
        } else alert('Add category failed!');
      });
  }

  apiPutCategory(id, cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/categories/' + id, cate, config)
      .then((res) => {
        if (res.data) {
          alert('Update category successfully!');
          this.apiGetCategories();
        } else alert('Update category failed!');
      })
      .catch(console.error);
  }

  apiDeleteCategory(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/categories/' + id, config)
      .then((res) => {
        if (res.data) {
          alert('Delete category successfully!');
          this.apiGetCategories();
        } else alert('Delete category failed!');
      })
      .catch(console.error);
  }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config)
      .then((res) => this.props.updateCategories(res.data))
      .catch(console.error);
  }
}

// ✨ NÂNG CẤP STYLE SANG TRỌNG
const styles = {
  container: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    maxWidth: '450px',
    margin: '20px auto',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center',
  },
  title: {
    margin: '0',
    fontSize: '24px',
    color: '#1a1a1a',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: '5px 0 0',
    fontSize: '14px',
    color: '#888',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#444',
    marginLeft: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1.5px solid #eee',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#f9f9f9',
  },
  inputReadOnly: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1.5px solid #eee',
    fontSize: '15px',
    backgroundColor: '#f1f1f1',
    color: '#777',
    cursor: 'not-allowed',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },
  divider: {
    width: '1px',
    backgroundColor: '#eee',
    margin: '0 5px',
  },
  addBtn: {
    flex: 1,
    background: '#000', // Đen sang trọng
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, opacity 0.2s',
  },
  updateBtn: {
    flex: 1,
    background: '#f0f0f0',
    color: '#1a1a1a',
    border: 'none',
    padding: '12px',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  deleteBtn: {
    width: '100%',
    background: '#fff',
    color: '#ff4d4f',
    border: '1.5px solid #ff4d4f',
    padding: '12px',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.2s',
  },
};

export default CategoryDetail;