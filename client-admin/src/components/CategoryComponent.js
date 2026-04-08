import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  render() {
    const cates = this.state.categories.map((item) => (
      <tr
        key={item._id}
        style={styles.row}
        onClick={() => this.trItemClick(item)}
      >
        <td>{item._id}</td>
        <td>{item.name}</td>
      </tr>
    ));

    return (
      <div style={styles.container}>
        <div style={styles.leftPanel}>
          <h2 style={styles.title}>CATEGORY LIST</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>{cates}</tbody>
          </table>
        </div>

        <div style={styles.rightPanel}>
          <CategoryDetail
            item={this.state.itemSelected}
            updateCategories={this.updateCategories}
            token={this.context.token}
          />
        </div>
      </div>
    );
  }

  // ================= EVENT =================
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  // ================= API =================
  apiGetCategories() {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios
      .get('/api/admin/categories', config)
      .then((res) => {
        this.setState({ categories: res.data });
      })
      .catch((error) => {
        console.error('Error loading categories:', error);
      });
  }

  updateCategories = (categories) => {
    this.setState({ categories: categories });
  };
}

// 🎨 STYLE
const styles = {
  container: {
    display: 'flex',
    padding: '20px',
    background: '#f4f6f9',
    minHeight: '100vh'
  },
  leftPanel: {
    flex: 1,
    marginRight: '20px',
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
  },
  rightPanel: {
    flex: 1,
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
  },
  title: {
    marginBottom: '15px',
    textAlign: 'center'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  row: {
    cursor: 'pointer',
    transition: '0.2s',
    textAlign: 'center',
    borderBottom: '1px solid #ddd'
  }
};

export default Category;