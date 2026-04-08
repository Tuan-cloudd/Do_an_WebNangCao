import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null
    };
  }

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }

  render() {
    const { products, noPages, curPage, itemSelected } = this.state;

    const productRows = products.map((item) => (
      <tr
        key={item._id}
        style={styles.row}
        onClick={() => this.trItemClick(item)}
      >
        <td>{item._id}</td>
        <td>{item.name}</td>
        <td>{item.price}</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{item.category?.name || 'N/A'}</td>
        <td>
          <img
            src={`data:image/jpg;base64,${item.image}`}
            style={styles.img}
            alt=""
          />
        </td>
      </tr>
    ));

    const pagination = Array.from({ length: noPages }, (_, index) => {
      const page = index + 1;
      if (page === curPage) {
        return (
          <span key={index} style={styles.activePage}>| <b>{page}</b> |</span>
        );
      }
      return (
        <span
          key={index}
          style={styles.pageLink}
          onClick={() => this.lnkPageClick(page)}
        >
          | {page} |
        </span>
      );
    });

    return (
      <div style={styles.container}>
        <div style={styles.leftPanel}>
          <h2 style={styles.title}>PRODUCT LIST</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Creation date</th>
                <th>Category</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {productRows}
              <tr>
                <td colSpan="6" style={styles.pagination}>
                  {pagination}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={styles.rightPanel}>
          <ProductDetail
            item={itemSelected}
            curPage={curPage}
            updateProducts={this.updateProducts}
          />
        </div>
      </div>
    );
  }

  updateProducts = (products, noPages) => {
    this.setState({ products, noPages });
  }

  lnkPageClick(page) {
    this.apiGetProducts(page);
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  apiGetProducts(page) {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios
      .get('/api/admin/products?page=' + page, config)
      .then((res) => {
        const result = res.data;
        this.setState({
          products: result.products,
          noPages: result.noPages,
          curPage: result.curPage
        });
      });
  }
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
    flex: 2,
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
    textAlign: 'center',
    marginBottom: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  row: {
    cursor: 'pointer',
    transition: '0.2s',
    textAlign: 'center',
    borderBottom: '1px solid #ddd',
    padding: '8px'
  },
  img: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '6px'
  },
  pagination: {
    textAlign: 'center',
    paddingTop: '10px'
  },
  pageLink: {
    cursor: 'pointer',
    color: '#007bff',
    margin: '0 5px'
  },
  activePage: {
    color: '#000',
    margin: '0 5px'
  }
};

export default Product;