import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
// import './ProductDetail.css';

class ProductDetail extends Component {
  static contextType = MyContext; // dùng this.context để truy cập global state

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: 0,
      cmbCategory: '',
      imgProduct: ''
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item) {
      const { _id, name, price, category, image } = this.props.item;
      this.setState({
        txtID: _id,
        txtName: name,
        txtPrice: price,
        cmbCategory: category ? category._id : '',
        imgProduct: 'data:image/jpg;base64,' + image
      });
    }
  }

  render() {
  const { categories, txtID, txtName, txtPrice, cmbCategory, imgProduct } = this.state;

  const categoryOptions = categories.map((cate) => (
    <option key={cate._id} value={cate._id}>{cate.name}</option>
  ));

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>PRODUCT DETAILS</h2>
      
      <form style={styles.form}>
        {/* Nhóm ID */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Product ID</label>
          <input 
            style={{...styles.input, ...styles.readOnly}} 
            type="text" value={txtID} readOnly 
          />
        </div>

        {/* Nhóm Name */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Product Name</label>
          <input 
            style={styles.input} 
            type="text" value={txtName} 
            onChange={(e) => this.setState({ txtName: e.target.value })} 
          />
        </div>

        {/* Nhóm Price & Category */}
        <div style={styles.row}>
          <div style={{...styles.inputGroup, flex: 1, marginRight: '10px'}}>
            <label style={styles.label}>Price (VNĐ)</label>
            <input 
              style={styles.input} 
              type="number" value={txtPrice} 
              onChange={(e) => this.setState({ txtPrice: e.target.value })} 
            />
          </div>
          <div style={{...styles.inputGroup, flex: 1}}>
            <label style={styles.label}>Category</label>
            <select 
              style={styles.input} 
              value={cmbCategory} 
              onChange={(e) => this.setState({ cmbCategory: e.target.value })}
            >
              <option value="">Select Category</option>
              {categoryOptions}
            </select>
          </div>
        </div>

        {/* Nhóm Image Upload */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Product Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => this.previewImage(e)} 
            style={styles.fileInput}
          />
          <div style={styles.imagePreviewWrapper}>
            {imgProduct ? (
              <img src={imgProduct} style={styles.imagePreview} alt="Preview" />
            ) : (
              <div style={styles.imagePlaceholder}>No image selected</div>
            )}
          </div>
        </div>

        {/* Nhóm Buttons */}
        <div style={styles.buttonGroup}>
          <button style={styles.btnAdd} onClick={(e) => this.btnAddClick(e)}>ADD NEW</button>
          <button style={styles.btnUpdate} onClick={(e) => this.btnUpdateClick(e)}>UPDATE</button>
          <button style={styles.btnDelete} onClick={(e) => this.btnDeleteClick(e)}>DELETE</button>
        </div>
      </form>
    </div>
  );
}

  // event-handlers
  previewImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      this.setState({ imgProduct: evt.target.result });
    };
    reader.readAsDataURL(file);
  }

  // apis
  apiGetCategories() {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios.get('/api/admin/categories', config).then((res) => {
      this.setState({ categories: res.data });
    });
  }
  // event-handlers
btnAddClick(e) {
  e.preventDefault();

  const { txtName, txtPrice, cmbCategory, imgProduct } = this.state;

  const name = txtName.trim();
  const price = parseInt(txtPrice);
  const category = cmbCategory;
  const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');

  if (name && !isNaN(price) && category && image) {
    const product = {
      name: name,
      price: price,
      category: category,
      image: image
    };
    this.apiPostProduct(product);
  } else {
    alert('Please input name, price, category and image');
  }
}

// apis
apiPostProduct(product) {
  const config = {
    headers: { 'x-access-token': this.context.token }
  };

  axios.post('/api/admin/products', product, config).then((res) => {
    if (res.data) {
      alert('OK BABY!');
      this.apiGetProducts();
    } else {
      alert('SORRY BABY!');
    }
  });
}

apiGetProducts() {
  const config = {
    headers: { 'x-access-token': this.context.token }
  };

  axios
    .get('/api/admin/products?page=' + this.props.curPage, config)
    .then((res) => {
      const result = res.data;
      this.props.updateProducts(result.products, result.noPages);
    });
}

// ================= update product =================
btnUpdateClick(e) {
  e.preventDefault();

  const id = this.state.txtID;
  const name = this.state.txtName;
  const price = parseInt(this.state.txtPrice);
  const category = this.state.cmbCategory;
  const image = this.state.imgProduct.replace(
    /^data:image\/[a-z]+;base64,/,
    ''
  ); // remove "data:image/...;base64,"

  if (id && name && price && category && image) {
    const prod = {
      name: name,
      price: price,
      category: category,
      image: image
    };
    this.apiPutProduct(id, prod);
  } else {
    alert('Please input id, name, price, category and image');
  }
}

// ================= apis =================
apiPutProduct(id, prod) {
  const config = {
    headers: { 'x-access-token': this.context.token }
  };

  axios
    .put('/api/admin/products/' + id, prod, config)
    .then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetProducts();
      } else {
        alert('SORRY BABY!');
      }
    });
}

// ================== Delete product ==================
btnDeleteClick(e) {
  e.preventDefault();

  if (window.confirm('ARE YOU SURE?')) {
    const id = this.state.txtID;

    if (id) {
      this.apiDeleteProduct(id);
    } else {
      alert('Please input id');
    }
  }
}

// ================== APIs ==================
apiDeleteProduct(id) {
  const config = {
    headers: { 'x-access-token': this.context.token }
  };

  axios
    .delete('/api/admin/products/' + id, config)
    .then((res) => {
      const result = res.data;

      if (result) {
        alert('OK BABY!');
        this.apiGetProducts();
      } else {
        alert('SORRY BABY!');
      }
    });
}

apiGetProducts() {
  const config = {
    headers: { 'x-access-token': this.context.token }
  };

  axios
    .get('/api/admin/products?page=' + this.props.curPage, config)
    .then((res) => {
      const result = res.data;

      if (result.products.length !== 0) {
        this.props.updateProducts(result.products, result.noPages);
      } else {
        axios
          .get(
            '/api/admin/products?page=' + (this.props.curPage - 1),
            config
          )
          .then((res) => {
            const result = res.data;
            this.props.updateProducts(result.products, result.noPages);
          });
      }
    });
}




}
const styles = {
  container: {
    // Thường chiếm 1/3 trang web
    padding: '30px',
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    marginLeft: '20px',
    minHeight: '80vh',
    fontFamily: "'Inter', sans-serif"
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '25px',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputGroup: {
    marginBottom: '18px',
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: '8px',
    marginLeft: '4px'
  },
  input: {
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid #e1e4e8',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    background: '#f8f9fa'
  },
  readOnly: {
    background: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed'
  },
  fileInput: {
    fontSize: '13px',
    marginBottom: '10px'
  },
  imagePreviewWrapper: {
    width: '100%',
    height: '250px',
    borderRadius: '12px',
    border: '2px dashed #d1d5db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    background: '#fdfdfd'
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  imagePlaceholder: {
    color: '#9ca3af',
    fontSize: '14px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  },
  btnAdd: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: '#000000',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.3s'
  },
  btnUpdate: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: '#f0f0f0',
    color: '#1a1a1a',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.3s'
  },
  btnDelete: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: '#ff4d4f',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.3s'
  }
};



export default ProductDetail;
