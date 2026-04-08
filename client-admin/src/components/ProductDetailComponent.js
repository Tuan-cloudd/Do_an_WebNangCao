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
    const { item } = this.props;

    // render danh sách category
    const categoryOptions = categories.map((cate) => (
      <option
        key={cate._id}
        value={cate._id}
        selected={item ? cate._id === item.category._id : false}
      >
        {cate.name}
      </option>
    ));

    return (
      <div className="float-right">
        <h2 className="text-center">PRODUCT DETAIL</h2>

        <form>
          <table>
            <tbody>
              <tr>
                <td>ID</td>
                <td>
                  <input
                    type="text"
                    value={txtID}
                    readOnly
                    onChange={(e) => this.setState({ txtID: e.target.value })}
                  />
                </td>
              </tr>

              <tr>
                <td>Name</td>
                <td>
                  <input
                    type="text"
                    value={txtName}
                    onChange={(e) => this.setState({ txtName: e.target.value })}
                  />
                </td>
              </tr>

              <tr>
                <td>Price</td>
                <td>
                  <input
                    type="text"
                    value={txtPrice}
                    onChange={(e) => this.setState({ txtPrice: e.target.value })}
                  />
                </td>
              </tr>

              <tr>
                <td>Image</td>
                <td>
                  <input
                    type="file"
                    name="fileImage"
                    accept="image/jpeg, image/png, image/gif"
                    onChange={(e) => this.previewImage(e)}
                  />
                </td>
              </tr>

              <tr>
                <td>Category</td>
                <td>
                  <select
                    value={cmbCategory}
                    onChange={(e) => this.setState({ cmbCategory: e.target.value })}
                  >
                    {categoryOptions}
                  </select>
                </td>
              </tr>

              <tr>
                <td></td>
                <td>
                  <input type="submit" value="ADD NEW" onClick={(e) => this.btnAddClick(e)} />
                  <input type="submit" value="UPDATE" onClick={(e) => this.btnUpdateClick(e)} />
                  <input type="submit" value="DELETE" onClick={(e) => this.btnDeleteClick(e)} />
                </td>
              </tr>

              <tr>
                <td colSpan="2">
                  <img src={imgProduct} width="300px" height="300px" alt="" />
                </td>
              </tr>
            </tbody>
          </table>
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



export default ProductDetail;
