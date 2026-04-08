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
        <h2 style={styles.title}>CATEGORY DETAIL</h2>

        <form>
          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={styles.label}>ID</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtID}
                    onChange={(e) => this.setState({ txtID: e.target.value })}
                    readOnly={true}
                    style={styles.input}
                  />
                </td>
              </tr>

              <tr>
                <td style={styles.label}>Name</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtName}
                    onChange={(e) => this.setState({ txtName: e.target.value })}
                    style={styles.input}
                  />
                </td>
              </tr>

              <tr>
                <td></td>
                <td>
                  <button style={styles.addBtn} onClick={(e) => this.btnAddClick(e)}>ADD NEW</button>
                  <button style={styles.updateBtn} onClick={(e) => this.btnUpdateClick(e)}>UPDATE</button>
                  <button style={styles.deleteBtn} onClick={(e) => this.btnDeleteClick(e)}>DELETE</button>
                </td>
              </tr>
            </tbody>
          </table>
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

// 🎨 STYLE
const styles = {
  container: {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    minWidth: '300px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  label: {
    paddingRight: '10px',
    fontWeight: 'bold',
    textAlign: 'right',
    width: '80px'
  },
  input: {
    width: '100%',
    padding: '6px 8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  },
  addBtn: {
    background: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    marginRight: '5px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  updateBtn: {
    background: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    marginRight: '5px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  deleteBtn: {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default CategoryDetail;