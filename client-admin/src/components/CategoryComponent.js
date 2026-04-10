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
    const cates = this.state.categories.map((item) => {
      // Kiểm tra xem hàng này có đang được chọn hay không
      const isSelected = this.state.itemSelected && this.state.itemSelected._id === item._id;
      
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
        </tr>
      );
    });

    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          {/* Bên trái: Danh sách */}
          <div style={styles.leftPanel}>
            <div style={styles.headerBox}>
              <h2 style={styles.title}>Category Management</h2>
              <span style={styles.countBadge}>{this.state.categories.length} Total</span>
            </div>
            
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.theadRow}>
                    <th style={styles.th}>REFERENCE ID</th>
                    <th style={styles.th}>CATEGORY NAME</th>
                  </tr>
                </thead>
                <tbody>{cates}</tbody>
              </table>
            </div>
          </div>

          {/* Bên phải: Chi tiết */}
          <div style={styles.rightPanel}>
            <CategoryDetail
              item={this.state.itemSelected}
              updateCategories={this.updateCategories}
              token={this.context.token}
            />
          </div>
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

// ✨ NÂNG CẤP STYLE SANG TRỌNG & HIỆN ĐẠI
const styles = {
  container: {
    padding: '40px 20px',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  wrapper: {
    display: 'flex',
    maxWidth: '1200px',
    margin: '0 auto',
    gap: '30px',
  },
  leftPanel: {
    flex: 1.5,
    background: '#fff',
    padding: '30px',
    borderRadius: '24px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
    border: '1px solid rgba(0,0,0,0.02)',
  },
  rightPanel: {
    flex: 1,
    // Panel này sẽ nhận style sang trọng từ CategoryDetail component
  },
  headerBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f1f1f1',
  },
  title: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: '-0.5px',
  },
  countBadge: {
    background: '#f0f0f0',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#666',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 8px', // Tạo khoảng cách giữa các hàng
  },
  theadRow: {
    textAlign: 'left',
  },
  th: {
    padding: '12px 15px',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#999',
    fontWeight: '600',
  },
  row: {
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: '#fff',
  },
  selectedRow: {
    backgroundColor: '#f8f9fa',
    transform: 'scale(1.01)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  tdId: {
    padding: '15px',
    fontSize: '13px',
    color: '#888',
    borderTopLeftRadius: '12px',
    borderBottomLeftRadius: '12px',
    borderBottom: '1px solid #f8f9fa',
  },
  tdName: {
    padding: '15px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#333',
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
    borderBottom: '1px solid #f8f9fa',
  },
};

export default Category;