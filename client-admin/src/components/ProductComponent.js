import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
  static contextType = MyContext; // dùng this.context để truy cập global state

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

    // render danh sách sản phẩm
    const productRows = products.map((item) => (
      <tr
        key={item._id}
        className="datatable"
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
            width="100px"
            height="100px"
            alt=""
          />
        </td>
      </tr>
    ));

    // render phân trang
    const pagination = Array.from({ length: noPages }, (_, index) => {
      const page = index + 1;
      if (page === curPage) {
        return (
          <span key={index}>| <b>{page}</b> |</span>
        );
      }
      return (
        <span
          key={index}
          className="link"
          onClick={() => this.lnkPageClick(page)}
        >
          | {page} |
        </span>
      );
    });

    return (
      <div>
        <div className="float-left">
          <h2 className="text-center">PRODUCT LIST</h2>

          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Creation date</th>
                <th>Category</th>
                <th>Image</th>
              </tr>

              {productRows}

              <tr>
                <td colSpan="6">{pagination}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="inline" />
        {/* <ProductDetail item={itemSelected} /> */}
         <ProductDetail item={this.state.itemSelected} curPage={this.state.curPage}
            updateProducts={this.updateProducts} />
        <div className="float-clear" />
      </div>
    );
  }
  updateProducts = (products, noPages) => { // arrow-function
    this.setState({ products: products, noPages: noPages });
  }

  // event-handlers
  lnkPageClick(page) {
    this.apiGetProducts(page);
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  // apis
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

export default Product;
