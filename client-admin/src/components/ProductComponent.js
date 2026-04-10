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

    const productRows = products.map((item) => {
      const isSelected = itemSelected && itemSelected._id === item._id;
      return (
        <tr
          key={item._id}
          style={{
            ...styles.row,
            ...(isSelected ? styles.selectedRow : {})
          }}
          onClick={() => this.trItemClick(item)}
        >
          <td style={styles.tdId}>{item._id}</td>
          <td style={styles.tdName}>{item.name}</td>
          <td style={styles.tdPrice}>${item.price.toLocaleString()}</td>
          <td style={styles.tdDate}>{new Date(item.cdate).toLocaleDateString()}</td>
          <td style={styles.tdCate}>
            <span style={styles.cateBadge}>{item.category?.name || 'N/A'}</span>
          </td>
          <td style={styles.tdImg}>
            <img
              src={`data:image/jpg;base64,${item.image}`}
              style={styles.img}
              alt={item.name}
            />
          </td>
        </tr>
      );
    });

    const pagination = Array.from({ length: noPages }, (_, index) => {
      const page = index + 1;
      return (
        <button
          key={index}
          style={{
            ...styles.pageBtn,
            ...(page === curPage ? styles.activePageBtn : {})
          }}
          onClick={() => this.lnkPageClick(page)}
        >
          {page}
        </button>
      );
    });

    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          {/* Left: Product List */}
          <div style={styles.leftPanel}>
            <div style={styles.headerBox}>
              <h2 style={styles.title}>Products</h2>
              <span style={styles.countBadge}>{products.length} items on this page</span>
            </div>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.theadRow}>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>NAME</th>
                    <th style={styles.th}>PRICE</th>
                    <th style={styles.th}>DATE</th>
                    <th style={styles.th}>CATEGORY</th>
                    <th style={styles.th}>IMAGE</th>
                  </tr>
                </thead>
                <tbody>{productRows}</tbody>
              </table>
            </div>

            <div style={styles.paginationBox}>
              {pagination}
            </div>
          </div>

          {/* Right: Product Detail */}
          <div style={styles.rightPanel}>
            <ProductDetail
              item={itemSelected}
              curPage={curPage}
              updateProducts={this.updateProducts}
            />
          </div>
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
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + page, config)
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

// ✨ NÂNG CẤP STYLE SANG TRỌNG
const styles = {
  container: {
    padding: '40px 20px',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif",
  },
  wrapper: {
    display: 'flex',
    maxWidth: '1400px',
    margin: '0 auto',
    gap: '25px',
  },
  leftPanel: {
    flex: 2.2, // Rộng hơn để chứa nhiều cột
    background: '#fff',
    padding: '30px',
    borderRadius: '24px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
  },
  rightPanel: {
    flex: 1,
  },
  headerBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  countBadge: {
    fontSize: '13px',
    color: '#888',
    background: '#f0f0f0',
    padding: '4px 12px',
    borderRadius: '20px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 10px',
  },
  th: {
    padding: '12px 15px',
    fontSize: '11px',
    color: '#aaa',
    textAlign: 'left',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  row: {
    cursor: 'pointer',
    background: '#fff',
    transition: 'all 0.2s ease',
  },
  selectedRow: {
    transform: 'scale(1.01)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    backgroundColor: '#f8faff',
  },
  tdId: {
    padding: '15px',
    fontSize: '12px',
    color: '#999',
    borderTopLeftRadius: '12px',
    borderBottomLeftRadius: '12px',
  },
  tdName: {
    padding: '15px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  tdPrice: {
    padding: '15px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#2ecc71',
  },
  tdDate: {
    padding: '15px',
    fontSize: '13px',
    color: '#666',
  },
  tdCate: {
    padding: '15px',
  },
  cateBadge: {
    background: '#eef2ff',
    color: '#4f46e5',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  tdImg: {
    padding: '10px',
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
  },
  img: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  paginationBox: {
    marginTop: '25px',
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
  },
  pageBtn: {
    border: 'none',
    background: '#fff',
    color: '#666',
    width: '35px',
    height: '35px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  activePageBtn: {
    background: '#1a1a1a',
    color: '#fff',
    transform: 'translateY(-2px)',
  },
};

export default Product;